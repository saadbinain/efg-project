<?php
require_once '../config/database.php';

$school_id = isset($_GET['school_id']) ? intval($_GET['school_id']) : 0;
if (!$school_id) {
    echo json_encode(["error" => "Missing school_id"]);
    exit;
}

// Get school details
$stmt = $pdo->prepare("SELECT id, name, address, city, logo_url, website, contact_email FROM schools WHERE id = ?");
$stmt->execute([$school_id]);
$school = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$school) {
    echo json_encode(["error" => "School not found"]);
    exit;
}

// Get all offerings for this school with course details and costs
$stmt = $pdo->prepare("
    SELECT co.id as offering_id, c.id as course_id, c.title, c.acronym, c.overview, c.duration_years,
           co.academic_year_start
    FROM course_offerings co
    JOIN courses c ON co.course_id = c.id
    WHERE co.school_id = ? AND co.is_active = 1
");
$stmt->execute([$school_id]);
$offerings = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch costs for each offering
foreach ($offerings as &$offering) {
    $costStmt = $pdo->prepare("
        SELECT oc.year_number, cc.component_name, oc.amount
        FROM offering_costs oc
        JOIN cost_components cc ON oc.component_id = cc.id
        WHERE oc.offering_id = ?
        ORDER BY oc.year_number, cc.display_order
    ");
    $costStmt->execute([$offering['offering_id']]);
    $costs = $costStmt->fetchAll(PDO::FETCH_ASSOC);
    $matrix = [];
    foreach ($costs as $cost) {
        $matrix[$cost['year_number']][$cost['component_name']] = $cost['amount'];
    }
    $offering['costs'] = $matrix;
}

$response = [
    'school' => $school,
    'offerings' => $offerings
];
echo json_encode($response);
?>