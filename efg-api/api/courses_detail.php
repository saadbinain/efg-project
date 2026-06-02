<?php
require_once '../config/database.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if (!$id) {
    echo json_encode(["error" => "Missing course id"]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id, title, acronym, overview, duration_years FROM courses WHERE id = ?");
    $stmt->execute([$id]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($course) {
        echo json_encode($course);
    } else {
        echo json_encode(["error" => "Course not found"]);
    }
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>