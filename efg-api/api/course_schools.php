<?php
require_once '../config/database.php';

$course_id = isset($_GET['course_id']) ? intval($_GET['course_id']) : 0;
if (!$course_id) {
    echo json_encode(["error" => "Missing course_id"]);
    exit();
}

try {
    // Get all offerings for this course
    $stmt = $pdo->prepare("
        SELECT co.id as offering_id, s.id as school_id, s.name as school_name, s.logo_url, co.academic_year_start
        FROM course_offerings co
        JOIN schools s ON co.school_id = s.id
        WHERE co.course_id = ? AND co.is_active = 1
    ");
    $stmt->execute([$course_id]);
    $offerings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // For each offering, fetch costs by year and component
    foreach ($offerings as &$offering) {
        $offering_id = $offering['offering_id'];
        $costStmt = $pdo->prepare("
            SELECT oc.year_number, cc.component_name, oc.amount
            FROM offering_costs oc
            JOIN cost_components cc ON oc.component_id = cc.id
            WHERE oc.offering_id = ?
            ORDER BY oc.year_number, cc.display_order
        ");
        $costStmt->execute([$offering_id]);
        $costs = $costStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Organize costs into a matrix: years as keys, components as subkeys
        $costMatrix = [];
        foreach ($costs as $cost) {
            $year = $cost['year_number'];
            $component = $cost['component_name'];
            $amount = $cost['amount'];
            if (!isset($costMatrix[$year])) $costMatrix[$year] = [];
            $costMatrix[$year][$component] = $amount;
        }
        $offering['costs'] = $costMatrix;
    }
    
    echo json_encode($offerings);
} catch(PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>