<?php
// api/courses.php

function handleCourses($db, $courseId = null) {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        if ($courseId) {
            getCourseById($db, $courseId);
        } else {
            getCourses($db);
        }
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
}

function getCourses($db) {
    $search = $_GET['search'] ?? '';
    if ($search) {
        $stmt = $db->prepare("SELECT id, name, acronym, overview, years_to_complete
                              FROM courses WHERE name ILIKE :search ORDER BY name");
        $stmt->execute(['search' => "%$search%"]);
    } else {
        $stmt = $db->query("SELECT id, name, acronym, overview, years_to_complete FROM courses ORDER BY name");
    }
    $courses = $stmt->fetchAll();
    echo json_encode($courses);
}

function getCourseById($db, $id) {
    // Get the course
    $stmt = $db->prepare("SELECT * FROM courses WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $course = $stmt->fetch();

    if (!$course) {
        http_response_code(404);
        echo json_encode(["error" => "Course not found"]);
        return;
    }

    // Fetch generic expenses for this course
    $stmtExp = $db->prepare("SELECT * FROM course_expenses WHERE course_id = :course_id ORDER BY year_number, item_name");
    $stmtExp->execute(['course_id' => $id]);
    $course['expenses'] = $stmtExp->fetchAll();

    // Fetch colleges that offer this course, with a flag if they have specific pricing
    $stmt2 = $db->prepare("
        SELECT 
            c.id, c.name, c.logo_url,
            CASE WHEN EXISTS (
                SELECT 1 FROM college_course_expenses cce 
                WHERE cce.college_course_id = cc.id
            ) THEN true ELSE false END AS has_specific_pricing
        FROM colleges c
        INNER JOIN college_courses cc ON c.id = cc.college_id
        WHERE cc.course_id = :course_id
        ORDER BY c.name
    ");
    $stmt2->execute(['course_id' => $id]);
    $colleges = $stmt2->fetchAll();
    $course['colleges'] = $colleges;

    echo json_encode($course);
}