<?php
require_once '../config/database.php';
$stmt = $pdo->query("SELECT id, name, address, city, logo_url, website, contact_email FROM schools ORDER BY name");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>