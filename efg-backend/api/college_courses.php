<?php
// api/college_courses.php

function handleCollegeCourses($db) {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $college_id = $_GET['college_id'] ?? null;
        $course_id  = $_GET['course_id']  ?? null;

        if (!$college_id || !$course_id) {
            http_response_code(400);
            echo json_encode(["error" => "Both college_id and course_id are required"]);
            return;
        }

        $stmt = $db->prepare("
            SELECT * FROM college_courses
            WHERE college_id = :college_id AND course_id = :course_id
        ");
        $stmt->execute(['college_id' => $college_id, 'course_id' => $course_id]);
        $pricing = $stmt->fetch();

        if ($pricing) {
            echo json_encode($pricing);
        } else {
            $stmt2 = $db->prepare("SELECT generic_tuition, generic_books, generic_uniform, generic_misc FROM courses WHERE id = :id");
            $stmt2->execute(['id' => $course_id]);
            $generic = $stmt2->fetch();
            if ($generic) {
                echo json_encode([
                    'specific_tuition' => $generic['generic_tuition'],
                    'specific_books'   => $generic['generic_books'],
                    'specific_uniform' => $generic['generic_uniform'],
                    'specific_misc'    => $generic['generic_misc'],
                    'is_generic'       => true
                ]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Course not found"]);
            }
        }
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
}