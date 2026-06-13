<?php
// api/admin_courses.php

function handleAdminCourses($db, $courseId) {
    $method = $_SERVER['REQUEST_METHOD'];

    // List all courses (or get single)
    if ($method === 'GET') {
        if ($courseId) {
            $stmt = $db->prepare("SELECT * FROM courses WHERE id = :id");
            $stmt->execute(['id' => $courseId]);
            $course = $stmt->fetch();
            if (!$course) {
                http_response_code(404);
                echo json_encode(['error' => 'Course not found']);
                return;
            }
            echo json_encode($course);
        } else {
            $stmt = $db->query("SELECT * FROM courses ORDER BY name");
            echo json_encode($stmt->fetchAll());
        }
        return;
    }

    // Create new course
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("INSERT INTO courses (name, acronym, overview, years_to_complete) VALUES (:name, :acronym, :overview, :years)");
        $stmt->execute([
            'name'     => $input['name'],
            'acronym'  => $input['acronym'] ?? '',
            'overview' => $input['overview'] ?? '',
            'years'    => $input['years_to_complete'] ?? 4
        ]);
        echo json_encode(['id' => $db->lastInsertId(), 'success' => true]);
        return;
    }

    // Update course
    if ($method === 'PUT' && $courseId) {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("UPDATE courses SET name = :name, acronym = :acronym, overview = :overview, years_to_complete = :years WHERE id = :id");
        $stmt->execute([
            'id'       => $courseId,
            'name'     => $input['name'],
            'acronym'  => $input['acronym'] ?? '',
            'overview' => $input['overview'] ?? '',
            'years'    => $input['years_to_complete'] ?? 4
        ]);
        echo json_encode(['success' => true]);
        return;
    }

    // Delete course
    if ($method === 'DELETE' && $courseId) {
        $stmt = $db->prepare("DELETE FROM courses WHERE id = :id");
        $stmt->execute(['id' => $courseId]);
        echo json_encode(['success' => true]);
        return;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}