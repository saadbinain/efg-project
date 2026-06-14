<?php
// config/database.php

class Database {
    private $host;
    private $port;
    private $dbname;
    private $user;
    private $password;
    public $conn;

    public function __construct() {
        // Supabase PostgreSQL credentials
        // Obtain from: Supabase Dashboard → Settings → Database → Connection string
        $this->host = 'aws-1-ap-southeast-2.pooler.supabase.com';
        $this->port = '6543';
        $this->dbname = 'postgres';
        $this->user = 'postgres.rxufyopyzvhggttlcfvo';
        $this->password = 'Lordsaga2468#';

        $dsn = "pgsql:host={$this->host};port={$this->port};dbname={$this->dbname}";
        try {
            $this->conn = new PDO($dsn, $this->user, $this->password, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::ATTR_PERSISTENT         => true,   // Reuse connections — avoids 300-800ms TCP handshake per request
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
            exit;
        }
    }
}