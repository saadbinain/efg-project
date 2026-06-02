<?php
require_once '../../config/database.php';
require_once 'auth_helper.php';

$admin_id = verifyAdminToken($pdo);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("
        SELECT co.id, co.school_id, co.course_id, co.academic_year_start, co.is_active,
               c.title as course_title, s.name as school_name
        FROM course_offerings co
        JOIN courses c ON co.course_id = c.id
        JOIN schools s ON co.school_id = s.id
    ");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if ($method === 'POST') {
    $stmt = $pdo->prepare("INSERT INTO course_offerings (school_id, course_id, academic_year_start, is_active) VALUES (?,?,?,?)");
    $stmt->execute([$data['school_id'], $data['course_id'], $data['academic_year_start'], $data['is_active'] ?? 1]);
    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
    exit;
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? 0;
    $stmt = $pdo->prepare("UPDATE course_offerings SET school_id=?, course_id=?, academic_year_start=?, is_active=? WHERE id=?");
    $stmt->execute([$data['school_id'], $data['course_id'], $data['academic_year_start'], $data['is_active'] ?? 1, $id]);
    echo json_encode(["success" => true]);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    $stmt = $pdo->prepare("DELETE FROM course_offerings WHERE id=?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
    exit;
}
?>