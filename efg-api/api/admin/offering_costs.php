<?php
require_once '../../config/database.php';
require_once 'auth_helper.php';

$admin_id = verifyAdminToken($pdo);
$method = $_SERVER['REQUEST_METHOD'];

// GET: retrieve costs for an offering
if ($method === 'GET') {
    $offering_id = $_GET['offering_id'] ?? 0;
    $stmt = $pdo->prepare("SELECT * FROM offering_costs WHERE offering_id = ?");
    $stmt->execute([$offering_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

// POST: update all costs for an offering (replace all)
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $offering_id = $data['offering_id'];
    $costs = $data['costs']; // matrix: year => component_id => amount
    $years = $data['years'];
    $components = $data['components'];

    // Begin transaction
    $pdo->beginTransaction();
    try {
        // Delete existing costs for this offering
        $stmt = $pdo->prepare("DELETE FROM offering_costs WHERE offering_id = ?");
        $stmt->execute([$offering_id]);

        // Insert new costs
        $insert = $pdo->prepare("INSERT INTO offering_costs (offering_id, year_number, component_id, amount) VALUES (?, ?, ?, ?)");
        foreach ($years as $year) {
            if (isset($costs[$year])) {
                foreach ($components as $comp) {
                    $amount = isset($costs[$year][$comp['id']]) ? $costs[$year][$comp['id']] : 0;
                    if ($amount > 0) {
                        $insert->execute([$offering_id, $year, $comp['id'], $amount]);
                    }
                }
            }
        }
        $pdo->commit();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
    exit;
}
?>