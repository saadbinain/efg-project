<?php
// api/admin_college_course_expenses.php

function handleAdminCollegeCourseExpenses($db, $collegeId, $courseId, $expenseId = null) {
    $method = $_SERVER['REQUEST_METHOD'];

    // Resolve college_course_id
    $stmtCc = $db->prepare("SELECT id FROM college_courses WHERE college_id = :cid AND course_id = :course_id");
    $stmtCc->execute(['cid' => $collegeId, 'course_id' => $courseId]);
    $cc = $stmtCc->fetch();

    if (!$cc) {
        http_response_code(404);
        echo json_encode(['error' => 'Course is not assigned to this college']);
        return;
    }
    $collegeCourseId = $cc['id'];

    // GET all expenses for this college-course mapping
    if ($method === 'GET') {
        $year = $_GET['year'] ?? null;
        $sql = "SELECT * FROM college_course_expenses WHERE college_course_id = :ccid";
        $params = ['ccid' => $collegeCourseId];
        if ($year) {
            $sql .= " AND year_number = :year";
            $params['year'] = $year;
        }
        $sql .= " ORDER BY year_number, item_name";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        echo json_encode($stmt->fetchAll());
        return;
    }

    // POST – add an expense item specific to this college-course mapping
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['year_number']) || !isset($input['item_name']) || !isset($input['amount'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing year_number, item_name, or amount']);
            return;
        }

        $stmt = $db->prepare("
            INSERT INTO college_course_expenses (college_course_id, year_number, item_name, amount) 
            VALUES (:ccid, :year, :item, :amount)
        ");
        $stmt->execute([
            'ccid'   => $collegeCourseId,
            'year'   => $input['year_number'],
            'item'   => $input['item_name'],
            'amount' => $input['amount']
        ]);
        echo json_encode(['id' => $db->lastInsertId(), 'success' => true]);
        return;
    }

    // PUT – update a specific expense item
    if ($method === 'PUT' && $expenseId) {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!isset($input['year_number']) || !isset($input['item_name']) || !isset($input['amount'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing year_number, item_name, or amount']);
            return;
        }

        $stmt = $db->prepare("
            UPDATE college_course_expenses 
            SET year_number = :year, item_name = :item, amount = :amount 
            WHERE id = :id AND college_course_id = :ccid
        ");
        $stmt->execute([
            'id'     => $expenseId,
            'ccid'   => $collegeCourseId,
            'year'   => $input['year_number'],
            'item'   => $input['item_name'],
            'amount' => $input['amount']
        ]);
        echo json_encode(['success' => true]);
        return;
    }

    // DELETE – remove a specific expense item
    if ($method === 'DELETE' && $expenseId) {
        $stmt = $db->prepare("
            DELETE FROM college_course_expenses 
            WHERE id = :id AND college_course_id = :ccid
        ");
        $stmt->execute(['id' => $expenseId, 'ccid' => $collegeCourseId]);
        echo json_encode(['success' => true]);
        return;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
