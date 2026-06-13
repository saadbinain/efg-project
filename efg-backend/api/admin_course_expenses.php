<?php
// api/admin_course_expenses.php
function handleAdminCourseExpenses($db, $courseId, $expenseId = null) {
    $method = $_SERVER['REQUEST_METHOD'];

    // GET all expenses for a course (optionally filter by year)
    if ($method === 'GET') {
        $year = $_GET['year'] ?? null;
        $sql = "SELECT * FROM course_expenses WHERE course_id = :course_id";
        $params = ['course_id' => $courseId];
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

    // POST – add an expense item
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("INSERT INTO course_expenses (course_id, year_number, item_name, amount) VALUES (:course_id, :year, :item, :amount)");
        $stmt->execute([
            'course_id' => $courseId,
            'year'      => $input['year_number'],
            'item'      => $input['item_name'],
            'amount'    => $input['amount']
        ]);
        echo json_encode(['id' => $db->lastInsertId(), 'success' => true]);
        return;
    }

    // PUT – update an expense item
    if ($method === 'PUT' && $expenseId) {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("UPDATE course_expenses SET year_number=:year, item_name=:item, amount=:amount WHERE id=:id AND course_id=:course_id");
        $stmt->execute([
            'id'        => $expenseId,
            'course_id' => $courseId,
            'year'      => $input['year_number'],
            'item'      => $input['item_name'],
            'amount'    => $input['amount']
        ]);
        echo json_encode(['success' => true]);
        return;
    }

    // DELETE – remove an expense item
    if ($method === 'DELETE' && $expenseId) {
        $stmt = $db->prepare("DELETE FROM course_expenses WHERE id=:id AND course_id=:course_id");
        $stmt->execute(['id' => $expenseId, 'course_id' => $courseId]);
        echo json_encode(['success' => true]);
        return;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}