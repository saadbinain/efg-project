<?php
function verifyAdminToken($pdo) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    } else {
        $token = '';
    }
    if (empty($token)) {
        http_response_code(401);
        echo json_encode(["error" => "No token provided"]);
        exit();
    }
    $stmt = $pdo->prepare("SELECT admin_id FROM admin_tokens WHERE token = ?");
    $stmt->execute([$token]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$result) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid token"]);
        exit();
    }
    return $result['admin_id'];
}
?>