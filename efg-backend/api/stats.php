<?php
// api/stats.php

function handleStats($db, $action = null) {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        try {
            $coursesCount = $db->query("SELECT COUNT(*) FROM courses")->fetchColumn();
            $collegesCount = $db->query("SELECT COUNT(*) FROM colleges")->fetchColumn();
            
            $studentsGuided = $db->query("SELECT value FROM site_stats WHERE key = 'students_guided'")->fetchColumn();
            if ($studentsGuided === false) {
                $studentsGuided = 1000;
            }

            echo json_encode([
                'courses_count' => (int)$coursesCount,
                'colleges_count' => (int)$collegesCount,
                'students_guided' => (int)$studentsGuided
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        return;
    }

    if ($method === 'POST' && $action === 'increment') {
        try {
            $db->exec("UPDATE site_stats SET value = value + 1 WHERE key = 'students_guided'");
            $updatedValue = $db->query("SELECT value FROM site_stats WHERE key = 'students_guided'")->fetchColumn();
            
            echo json_encode([
                'success' => true,
                'students_guided' => (int)$updatedValue
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
        return;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
