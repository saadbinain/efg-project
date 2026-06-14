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
                              FROM courses WHERE name ILIKE :search OR acronym ILIKE :search ORDER BY name");
        $stmt->execute(['search' => "%$search%"]);
    } else {
        // Cache the full list for 60 seconds — courses don't change constantly
        header('Cache-Control: public, max-age=60');
        $stmt = $db->query("SELECT id, name, acronym, overview, years_to_complete FROM courses ORDER BY name");
    }
    $courses = $stmt->fetchAll();
    echo json_encode($courses);
}

function getCourseById($db, $id) {
    // Cache course detail for 60 seconds — second visit is instant
    header('Cache-Control: public, max-age=60');

    // Single query: course + all expenses + colleges offering it
    // Fetch course first
    $stmt = $db->prepare("SELECT * FROM courses WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $course = $stmt->fetch();

    if (!$course) {
        http_response_code(404);
        echo json_encode(["error" => "Course not found"]);
        return;
    }

    $collegeId = $_GET['college_id'] ?? null;
    if ($collegeId) {
        // Fetch college context and confirm relationship exists
        $stmtCc = $db->prepare("
            SELECT cc.id, c.name AS college_name, c.logo_url AS college_logo_url
            FROM college_courses cc
            INNER JOIN colleges c ON cc.college_id = c.id
            WHERE cc.college_id = :college_id AND cc.course_id = :course_id
        ");
        $stmtCc->execute(['college_id' => $collegeId, 'course_id' => $id]);
        $collegeCourse = $stmtCc->fetch();

        if ($collegeCourse) {
            $course['college'] = [
                'id' => (int)$collegeId,
                'name' => $collegeCourse['college_name'],
                'logo_url' => $collegeCourse['college_logo_url']
            ];

            // Fetch specific expenses for this college course
            $stmtExp = $db->prepare("
                SELECT id, year_number, item_name, amount
                FROM college_course_expenses
                WHERE college_course_id = :college_course_id
                ORDER BY year_number, item_name
            ");
            $stmtExp->execute(['college_course_id' => $collegeCourse['id']]);
            $course['expenses'] = $stmtExp->fetchAll();

            // Fallback to generic expenses if no college-specific pricing is defined
            if (empty($course['expenses'])) {
                $stmtGenericExp = $db->prepare("
                    SELECT id, year_number, item_name, amount
                    FROM course_expenses
                    WHERE course_id = :course_id
                    ORDER BY year_number, item_name
                ");
                $stmtGenericExp->execute(['course_id' => $id]);
                $course['expenses'] = $stmtGenericExp->fetchAll();
            }
        } else {
            $course['college'] = null;
            $course['expenses'] = [];
        }
    } else {
        // Fetch expenses and colleges in parallel using a single combined query
        // Expenses for this course (all years at once)
        $stmtExp = $db->prepare(
            "SELECT id, year_number, item_name, amount
             FROM course_expenses
             WHERE course_id = :course_id
             ORDER BY year_number, item_name"
        );
        $stmtExp->execute(['course_id' => $id]);
        $course['expenses'] = $stmtExp->fetchAll();
    }

    // Colleges offering this course with specific-pricing flag
    $stmt2 = $db->prepare("
        SELECT
            c.id, c.name, c.logo_url,
            EXISTS (
                SELECT 1 FROM college_course_expenses cce
                WHERE cce.college_course_id = cc.id
            ) AS has_specific_pricing
        FROM colleges c
        INNER JOIN college_courses cc ON c.id = cc.college_id
        WHERE cc.course_id = :course_id
        ORDER BY c.name
    ");
    $stmt2->execute(['course_id' => $id]);
    $colleges = $stmt2->fetchAll();

    // Cast boolean from PostgreSQL string 't'/'f' to real bool
    foreach ($colleges as &$col) {
        $col['has_specific_pricing'] = ($col['has_specific_pricing'] === 't' || $col['has_specific_pricing'] === true);
    }

    $course['colleges'] = $colleges;
    echo json_encode($course);
}