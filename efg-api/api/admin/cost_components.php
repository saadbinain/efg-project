<?php
require_once '../../config/database.php';
require_once 'auth_helper.php';

$admin_id = verifyAdminToken($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, component_name, display_order FROM cost_components ORDER BY display_order");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if ($method === 'POST') {
    $stmt = $pdo->prepare("INSERT INTO cost_components (component_name, display_order) VALUES (?,?)");
    $stmt->execute([$data['component_name'], $data['display_order'] ?? 0]);
    echo json_encode(["success" => true]);
    exit;
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? 0;
    $stmt = $pdo->prepare("UPDATE cost_components SET component_name=?, display_order=? WHERE id=?");
    $stmt->execute([$data['component_name'], $data['display_order'] ?? 0, $id]);
    echo json_encode(["success" => true]);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    $stmt = $pdo->prepare("DELETE FROM cost_components WHERE id=?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
    exit;
}
?>