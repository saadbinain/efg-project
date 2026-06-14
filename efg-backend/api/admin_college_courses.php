<?php
// api/admin_college_courses.php

function handleAdminCollegeCourses($db, $collegeId, $courseId = null) {
    $method = $_SERVER['REQUEST_METHOD'];

    // GET all courses assigned to this college
    if ($method === 'GET') {
        $stmt = $db->prepare("
            SELECT c.id, c.name, c.acronym, c.years_to_complete, cc.id AS college_course_id
            FROM college_courses cc
            JOIN courses c ON cc.course_id = c.id
            WHERE cc.college_id = :college_id
            ORDER BY c.name
        ");
        $stmt->execute(['college_id' => $collegeId]);
        echo json_encode($stmt->fetchAll());
        return;
    }

    // POST – add a course to the college
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['course_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing course_id']);
            return;
        }

        $stmt = $db->prepare("
            INSERT INTO college_courses (college_id, course_id)
            VALUES (:cid, :course_id)
            ON CONFLICT (college_id, course_id) DO NOTHING
        ");
        $stmt->execute([
            'cid'       => $collegeId,
            'course_id' => $input['course_id']
        ]);
        echo json_encode(['success' => true]);
        return;
    }

    // DELETE – remove course from college (also deletes its specific expenses cascade style)
    if ($method === 'DELETE' && $courseId) {
        // First delete associated course expenses
        $stmtDelExp = $db->prepare("
            DELETE FROM college_course_expenses 
            WHERE college_course_id = (
                SELECT id FROM college_courses 
                WHERE college_id = :cid AND course_id = :course_id
            )
        ");
        $stmtDelExp->execute(['cid' => $collegeId, 'course_id' => $courseId]);

        // Then delete the college course mapping
        $stmt = $db->prepare("
            DELETE FROM college_courses 
            WHERE college_id = :cid AND course_id = :course_id
        ");
        $stmt->execute(['cid' => $collegeId, 'course_id' => $courseId]);
        echo json_encode(['success' => true]);
        return;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}