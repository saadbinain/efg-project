<?php
require_once '../../config/database.php';
session_start();

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Username and password required"]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT id, password_hash FROM admin_users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password_hash'])) {
        // Generate a simple random token
        $token = bin2hex(random_bytes(32));
        // Store token in admin_tokens table
        $stmt = $pdo->prepare("INSERT INTO admin_tokens (admin_id, token) VALUES (?, ?)");
        $stmt->execute([$user['id'], $token]);
        
        echo json_encode(["success" => true, "token" => $token]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    }
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>