<?php
// api/admin_college_courses.php

function handleAdminCollegeCourses($db, $collegeId, $courseId = null) {
    $method = $_SERVER['REQUEST_METHOD'];

    // GET all courses assigned to this college
    if ($method === 'GET') {
        $stmt = $db->prepare("
            SELECT c.id, c.name, cc.specific_tuition, cc.specific_books, cc.specific_uniform, cc.specific_misc
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
        $stmt = $db->prepare("INSERT INTO college_courses (college_id, course_id, specific_tuition, specific_books, specific_uniform, specific_misc) VALUES (:cid, :course_id, :t, :b, :u, :m) ON CONFLICT (college_id, course_id) DO NOTHING");
        $stmt->execute([
            'cid'       => $collegeId,
            'course_id' => $input['course_id'],
            't'         => $input['specific_tuition'] ?? 0,
            'b'         => $input['specific_books'] ?? 0,
            'u'         => $input['specific_uniform'] ?? 0,
            'm'         => $input['specific_misc'] ?? 0
        ]);
        echo json_encode(['success' => true]);
        return;
    }

    // PUT – update pricing for a specific course
    if ($method === 'PUT' && $courseId) {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("UPDATE college_courses SET specific_tuition = :t, specific_books = :b, specific_uniform = :u, specific_misc = :m WHERE college_id = :cid AND course_id = :course_id");
        $stmt->execute([
            'cid'       => $collegeId,
            'course_id' => $courseId,
            't'         => $input['specific_tuition'],
            'b'         => $input['specific_books'],
            'u'         => $input['specific_uniform'],
            'm'         => $input['specific_misc']
        ]);
        echo json_encode(['success' => true]);
        return;
    }

    // DELETE – remove course from college
    if ($method === 'DELETE' && $courseId) {
        $stmt = $db->prepare("DELETE FROM college_courses WHERE college_id = :cid AND course_id = :course_id");
        $stmt->execute(['cid' => $collegeId, 'course_id' => $courseId]);
        echo json_encode(['success' => true]);
        return;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}