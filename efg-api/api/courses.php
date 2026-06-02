<?php
require_once '../config/database.php';

try {
    $stmt = $pdo->query("SELECT id, title, acronym, overview, duration_years FROM courses ORDER BY title");
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($courses);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>