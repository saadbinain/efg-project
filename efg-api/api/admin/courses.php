<?php
require_once '../../config/database.php';
require_once 'auth_helper.php';

// Verify admin token
$admin_id = verifyAdminToken($pdo);

$data = json_decode(file_get_contents("php://input"), true);
$title = $data['title'] ?? '';
$acronym = $data['acronym'] ?? '';
$overview = $data['overview'] ?? '';
$duration_years = $data['duration_years'] ?? 4;

if (empty($title)) {
    echo json_encode(["success" => false, "message" => "Title required"]);
    exit();
}

try {
    $stmt = $pdo->prepare("INSERT INTO courses (title, acronym, overview, duration_years) VALUES (?, ?, ?, ?)");
    $stmt->execute([$title, $acronym, $overview, $duration_years]);
    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>