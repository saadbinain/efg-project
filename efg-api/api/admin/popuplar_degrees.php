<?php
require_once '../../config/database.php';
require_once 'auth_helper.php';

$admin_id = verifyAdminToken($pdo);
$method = $_SERVER['REQUEST_METHOD'];

$data = json_decode(file_get_contents("php://input"), true);

if ($method === 'POST') {
    $stmt = $pdo->prepare("INSERT INTO popular_degrees (course_id, display_order) VALUES (?,?)");
    $stmt->execute([$data['course_id'], $data['display_order'] ?? 0]);
    echo json_encode(["success" => true]);
    exit;
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? 0;
    $stmt = $pdo->prepare("UPDATE popular_degrees SET course_id=?, display_order=? WHERE id=?");
    $stmt->execute([$data['course_id'], $data['display_order'] ?? 0, $id]);
    echo json_encode(["success" => true]);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    $stmt = $pdo->prepare("DELETE FROM popular_degrees WHERE id=?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
    exit;
}
?>