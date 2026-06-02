<?php
require_once '../config/database.php';

$slug = isset($_GET['slug']) ? $_GET['slug'] : '';
if (empty($slug)) {
    echo json_encode(["error" => "Missing slug parameter"]);
    exit;
}

$stmt = $pdo->prepare("SELECT title, content_html FROM static_pages WHERE page_slug = ?");
$stmt->execute([$slug]);
$page = $stmt->fetch(PDO::FETCH_ASSOC);

if ($page) {
    echo json_encode($page);
} else {
    echo json_encode(["error" => "Page not found"]);
}
?>