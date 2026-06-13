<?php
$json = file_get_contents('token.json');
$data = json_decode($json, true);
if (!$data || !isset($data['access_token'])) {
    echo "FAIL: Could not find access_token in token.json\n";
    exit;
}
$token = $data['access_token'];
echo "Token loaded. Starting validation...\n\n";

// Helper function
function base64url_decode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

// Step 1: Split token
echo "STEP 1: Splitting token\n";
$parts = explode('.', $token);
echo "Parts count: " . count($parts) . "\n";
if (count($parts) !== 3) {
    echo "FAIL - token must have 3 parts\n";
    exit;
}
list($headerB64, $payloadB64, $signatureB64) = $parts;

// Step 2: Decode header
echo "\nSTEP 2: Decoding header\n";
$header = json_decode(base64url_decode($headerB64), true);
if (!$header) {
    echo "FAIL - header decode failed\n";
    exit;
}
echo "Algorithm: " . ($header['alg'] ?? 'MISSING') . "\n";
echo "Key ID: " . ($header['kid'] ?? 'MISSING') . "\n";
if ($header['alg'] !== 'ES256') {
    echo "FAIL - algorithm is not ES256\n";
    exit;
}

// Step 3: Fetch JWKS
echo "\nSTEP 3: Fetching JWKS\n";
$jwksUrl = 'https://rxufyopyzvhggttlcfvo.supabase.co/auth/v1/.well-known/jwks.json';
$jwksJson = @file_get_contents($jwksUrl);
if ($jwksJson === false) {
    echo "FAIL - could not fetch JWKS\n";
    exit;
}
echo "JWKS fetched OK.\n";
$keys = json_decode($jwksJson, true)['keys'] ?? [];
echo "Number of keys: " . count($keys) . "\n";
$publicKey = null;
foreach ($keys as $key) {
    echo "  Checking kid: " . ($key['kid'] ?? '?') . "\n";
    if (isset($key['kid']) && $key['kid'] === $header['kid'] && isset($key['x5c'][0])) {
        echo "  -> MATCH!\n";
        $cert = "-----BEGIN CERTIFICATE-----\n" . $key['x5c'][0] . "\n-----END CERTIFICATE-----";
        $pub = openssl_pkey_get_public($cert);
        if ($pub) {
            $publicKey = $pub;
            echo "  -> Public key extracted successfully.\n";
            break;
        } else {
            echo "  -> FAILED to extract public key: " . openssl_error_string() . "\n";
            exit;
        }
    }
}
if (!$publicKey) {
    echo "FAIL - no matching public key for kid " . $header['kid'] . "\n";
    exit;
}

// Step 4: Verify signature
echo "\nSTEP 4: Verifying signature\n";
$signedPayload = "$headerB64.$payloadB64";
$signature = base64url_decode($signatureB64);
$result = openssl_verify($signedPayload, $signature, $publicKey, OPENSSL_ALGO_SHA256);
if ($result === 1) {
    echo "Signature VERIFIED.\n";
} elseif ($result === 0) {
    echo "Signature INVALID. OpenSSL error: " . openssl_error_string() . "\n";
    exit;
} else {
    echo "Signature verification ERROR: " . openssl_error_string() . "\n";
    exit;
}

// Step 5: Expiration
echo "\nSTEP 5: Checking expiration\n";
$payload = json_decode(base64url_decode($payloadB64), true);
$exp = $payload['exp'] ?? null;
$now = time();
echo "Token exp: $exp, current server time: $now\n";
if ($exp && $exp < $now) {
    echo "FAIL - token expired.\n";
    exit;
}

echo "\n=== TOKEN IS VALID ===\n";
echo "User email: " . ($payload['email'] ?? 'none') . "\n";