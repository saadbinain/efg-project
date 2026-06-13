<?php
require 'config/auth.php';

$jwks = file_get_contents('https://rxufyopyzvhggttlcfvo.supabase.co/auth/v1/.well-known/jwks.json');
$keys = json_decode($jwks, true)['keys'];
$k = $keys[0];
echo "Key x: " . $k['x'] . "\n";
echo "Key y: " . $k['y'] . "\n\n";

$pem = ecPublicKeyToPem($k['x'], $k['y']);
echo "Generated PEM:\n" . $pem . "\n\n";

$pub = openssl_pkey_get_public($pem);
echo "openssl_pkey_get_public: " . ($pub ? "SUCCESS" : "FAILED") . "\n";
if (!$pub) {
    echo "OpenSSL error: " . openssl_error_string() . "\n";
} else {
    $details = openssl_pkey_get_details($pub);
    echo "Key type: " . $details['type'] . " (3=EC)\n";
    echo "Key bits: " . $details['bits'] . "\n";
}
