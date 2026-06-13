<?php
// config/auth.php

function validateJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;

    list($headerB64, $payloadB64, $signatureB64) = $parts;
    $header = json_decode(base64url_decode($headerB64), true);
    if (!$header || !isset($header['alg'], $header['kid'])) return false;
    if ($header['alg'] !== 'ES256') return false;

    // Fetch JWKS
    $jwksUrl = 'https://rxufyopyzvhggttlcfvo.supabase.co/auth/v1/.well-known/jwks.json';
    $jwks = @file_get_contents($jwksUrl);
    if ($jwks === false) return false;
    $keys = json_decode($jwks, true)['keys'] ?? [];

    // Find matching key by kid
    $key = null;
    foreach ($keys as $k) {
        if (isset($k['kid']) && $k['kid'] === $header['kid']) {
            $key = $k;
            break;
        }
    }
    if (!$key || !isset($key['x'], $key['y'], $key['crv'])) return false;

    // Build EC public key PEM from JWKS values
    $pem = ecPublicKeyToPem($key['x'], $key['y']);
    if (!$pem) return false;

    $publicKey = openssl_pkey_get_public($pem);
    if (!$publicKey) return false;

    // ES256 signature is raw (r || s) — each 32 bytes.
    // openssl_verify with SHA256 expects DER-encoded ECDSA signature.
    $rawSig = base64url_decode($signatureB64);
    if (strlen($rawSig) !== 64) return false;
    $r = substr($rawSig, 0, 32);
    $s = substr($rawSig, 32, 32);
    $derSig = derEncodeEcdsaSig($r, $s);

    // Verify signature
    $signedPayload = "$headerB64.$payloadB64";
    $result = openssl_verify($signedPayload, $derSig, $publicKey, OPENSSL_ALGO_SHA256);
    if ($result !== 1) return false;

    // Check expiration
    $payload = json_decode(base64url_decode($payloadB64), true);
    if (isset($payload['exp']) && $payload['exp'] < time()) return false;

    return $payload;
}

function base64url_decode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

/**
 * Build a PEM-encoded SubjectPublicKeyInfo for a P-256 EC key
 * from the base64url-encoded x and y coordinates.
 *
 * ASN.1 structure:
 *   SEQUENCE {
 *     SEQUENCE {
 *       OID 1.2.840.10045.2.1  (id-ecPublicKey)
 *       OID 1.2.840.10045.3.1.7 (prime256v1)
 *     }
 *     BIT STRING (0x00 + 0x04 + x + y)
 *   }
 */
function ecPublicKeyToPem($xB64, $yB64) {
    $x = base64url_decode($xB64);
    $y = base64url_decode($yB64);

    // Uncompressed EC point
    $point = "\x04" . $x . $y;

    // OID: id-ecPublicKey  1.2.840.10045.2.1
    $oidEcPublicKey = "\x06\x07\x2a\x86\x48\xce\x3d\x02\x01";
    // OID: prime256v1  1.2.840.10045.3.1.7
    $oidPrime256v1  = "\x06\x08\x2a\x86\x48\xce\x3d\x03\x01\x07";

    // AlgorithmIdentifier SEQUENCE { oid_ecPublicKey, oid_prime256v1 }
    $algorithmIdentifier = asn1Seq($oidEcPublicKey . $oidPrime256v1);

    // BIT STRING wrapping the EC point (prepend 0x00 = no unused bits)
    $bitString = "\x03" . asn1Len(strlen($point) + 1) . "\x00" . $point;

    // SubjectPublicKeyInfo SEQUENCE
    $spki = asn1Seq($algorithmIdentifier . $bitString);

    $pem  = "-----BEGIN PUBLIC KEY-----\n";
    $pem .= chunk_split(base64_encode($spki), 64, "\n");
    $pem .= "-----END PUBLIC KEY-----";
    return $pem;
}

function asn1Seq($data) {
    return "\x30" . asn1Len(strlen($data)) . $data;
}

function asn1Len($len) {
    if ($len < 128) {
        return chr($len);
    }
    $bytes = '';
    while ($len > 0) {
        $bytes = chr($len & 0xFF) . $bytes;
        $len >>= 8;
    }
    return chr(0x80 | strlen($bytes)) . $bytes;
}

/**
 * DER-encode an ECDSA signature from raw (r, s) byte strings.
 * Each integer must be treated as unsigned big-endian.
 */
function derEncodeEcdsaSig($r, $s) {
    $encodeInt = function($val) {
        // Strip leading zero bytes (keep at least 1)
        $val = ltrim($val, "\x00");
        if ($val === '') $val = "\x00";
        // Prepend 0x00 if high bit set (to keep it positive)
        if (ord($val[0]) & 0x80) $val = "\x00" . $val;
        return "\x02" . chr(strlen($val)) . $val;
    };
    $rDer = $encodeInt($r);
    $sDer = $encodeInt($s);
    return "\x30" . chr(strlen($rDer) + strlen($sDer)) . $rDer . $sDer;
}

function derEncodeBitString($data) {
    return "\x03" . derEncodeLength(strlen($data) + 1) . "\x00" . $data;
}

function derEncodeLength($length) {
    if ($length < 128) {
        return chr($length);
    }
    $lenBytes = '';
    while ($length > 0) {
        $lenBytes = chr($length & 0xFF) . $lenBytes;
        $length >>= 8;
    }
    return chr(0x80 | strlen($lenBytes)) . $lenBytes;
}