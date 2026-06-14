<?php
// api/colleges.php

function handleColleges($db, $collegeId = null) {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        if ($collegeId) {
            getCollegeById($db, $collegeId);
        } else {
            getColleges($db);
        }
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
}

function getColleges($db) {
    $stmt = $db->query("SELECT id, name, logo_url, locations, abbreviation FROM colleges ORDER BY name");
    $colleges = $stmt->fetchAll();
    foreach ($colleges as &$col) {
        $col['locations'] = json_decode($col['locations'], true) ?? [];
    }
    echo json_encode($colleges);
}

function getCollegeById($db, $id) {
    $stmt = $db->prepare("SELECT * FROM colleges WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $college = $stmt->fetch();

    if (!$college) {
        http_response_code(404);
        echo json_encode(["error" => "College not found"]);
        return;
    }

    $college['branches'] = json_decode($college['branches'], true) ?? [];
    $college['locations'] = json_decode($college['locations'], true) ?? [];
    $college['contacts'] = json_decode($college['contacts'], true) ?? (object)[];
    $college['social_media'] = json_decode($college['social_media'], true) ?? (object)[];
    $college['highlight_pictures_urls'] = json_decode($college['highlight_pictures_urls'], true) ?? [];

    $stmt2 = $db->prepare("
        SELECT c.id, c.name, c.acronym, c.overview, c.years_to_complete, cc.id AS college_course_id
        FROM courses c
        JOIN college_courses cc ON cc.course_id = c.id AND cc.college_id = :college_id
        ORDER BY c.name
    ");
    $stmt2->execute(['college_id' => $id]);
    $courses = $stmt2->fetchAll();

    // Fetch school-specific expenses for each course
    $stmt3 = $db->prepare("
        SELECT id, year_number, item_name, amount
        FROM college_course_expenses
        WHERE college_course_id = :college_course_id
        ORDER BY year_number, item_name
    ");

    foreach ($courses as &$course) {
        $stmt3->execute(['college_course_id' => $course['college_course_id']]);
        $course['expenses'] = $stmt3->fetchAll();
    }

    $college['courses'] = $courses;
    echo json_encode($college);
}