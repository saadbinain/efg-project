<?php
// debug_auth.php - temporary debug endpoint
// DELETE this file after fixing!

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$debug = [];

// Step 1: Read Authorization header all possible ways
$authHeader = '';
if (function_exists('getallheaders')) {
    $h = getallheaders();
    $debug['getallheaders_keys'] = array_keys($h);
    $authHeader = $h['Authorization'] ?? $h['authorization'] ?? '';
    $debug['getallheaders_auth'] = $authHeader ? 'FOUND' : 'MISSING';
}
if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    $debug['http_authorization_fallback'] = 'USED';
}
if (!$authHeader && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    $debug['redirect_http_authorization_fallback'] = 'USED';
}

$debug['final_auth_header'] = $authHeader ? substr($authHeader, 0, 30) . '...' : 'EMPTY';

if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    $debug['step'] = 'FAILED: No Bearer token in Authorization header';
    echo json_encode($debug, JSON_PRETTY_PRINT);
    exit;
}

$token = $matches[1];
$debug['token_preview'] = substr($token, 0, 20) . '...';

// Step 2: Parse JWT
$parts = explode('.', $token);
$debug['jwt_parts_count'] = count($parts);
if (count($parts) !== 3) {
    $debug['step'] = 'FAILED: JWT does not have 3 parts';
    echo json_encode($debug, JSON_PRETTY_PRINT);
    exit;
}

function b64url_decode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) $data .= str_repeat('=', 4 - $remainder);
    return base64_decode(strtr($data, '-_', '+/'));
}

list($headerB64, $payloadB64, $signatureB64) = $parts;
$header = json_decode(b64url_decode($headerB64), true);
$payload = json_decode(b64url_decode($payloadB64), true);

$debug['jwt_header'] = $header;
$debug['jwt_alg'] = $header['alg'] ?? 'MISSING';
$debug['jwt_kid'] = $header['kid'] ?? 'MISSING';
$debug['jwt_exp'] = $payload['exp'] ?? 'MISSING';
$debug['server_time'] = time();
$debug['token_expired'] = isset($payload['exp']) ? ($payload['exp'] < time() ? 'YES' : 'NO') : 'unknown';
$debug['jwt_email'] = $payload['email'] ?? ($payload['sub'] ?? 'MISSING');
$debug['jwt_role'] = $payload['role'] ?? 'MISSING';

// Step 3: Fetch JWKS
$jwksUrl = 'https://rxufyopyzvhggttlcfvo.supabase.co/auth/v1/.well-known/jwks.json';
$jwksJson = @file_get_contents($jwksUrl);
if ($jwksJson === false) {
    $debug['step'] = 'FAILED: Could not fetch JWKS from Supabase';
    echo json_encode($debug, JSON_PRETTY_PRINT);
    exit;
}
$keys = json_decode($jwksJson, true)['keys'] ?? [];
$debug['jwks_key_count'] = count($keys);
$debug['jwks_kids'] = array_column($keys, 'kid');
$debug['kid_match'] = in_array($header['kid'] ?? '', $debug['jwks_kids']) ? 'YES' : 'NO';

echo json_encode($debug, JSON_PRETTY_PRINT);
