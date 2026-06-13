<?php
// router.php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve static files if they exist
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// Route /api/admin
if (strpos($uri, '/api/admin') === 0) {
    require __DIR__ . '/api/admin.php';
    return;
}

// Route /api (public)
if (strpos($uri, '/api/') === 0) {
    require __DIR__ . '/api/index.php';
    return;
}

// Default fallback
require __DIR__ . '/api/index.php';