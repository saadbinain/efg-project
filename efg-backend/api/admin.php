<?php
// api/admin.php

require_once __DIR__ . '/../config/auth.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Authenticate via Bearer token
// getallheaders() can be unreliable on Windows + PHP built-in server,
// so fall back to $_SERVER['HTTP_AUTHORIZATION'] as well.
$authHeader = '';
if (function_exists('getallheaders')) {
    $h = getallheaders();
    // getallheaders keys are case-sensitive depending on SAPI
    $authHeader = $h['Authorization'] ?? $h['authorization'] ?? '';
}
if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
}
if (!$authHeader && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}
if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'Missing or malformed Authorization header']);
    exit;
}
$token = $matches[1];
$user = validateJWT($token);
if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid or expired token']);
    exit;
}

// Route to the correct resource
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);
$path = str_replace('/api/admin', '', $path);
$path = trim($path, '/');
$segments = explode('/', $path);

$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;
$subResource = $segments[2] ?? null;
$subId = $segments[3] ?? null;

require_once __DIR__ . '/../config/database.php';
$database = new Database();
$db = $database->conn;

switch ($resource) {
    case 'courses':
        // Route to expenses sub-resource or plain course CRUD
        if ($id && $subResource === 'expenses') {
            require_once 'admin_course_expenses.php';
            handleAdminCourseExpenses($db, $id, $subId);
        } else {
            require_once 'admin_courses.php';
            handleAdminCourses($db, $id);
        }
        break;

    case 'colleges':
        if ($id && $subResource === 'courses') {
            require_once 'admin_college_courses.php';
            handleAdminCollegeCourses($db, $id, $subId);
        } else {
            require_once 'admin_colleges.php';
            handleAdminColleges($db, $id);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Admin endpoint not found']);
}