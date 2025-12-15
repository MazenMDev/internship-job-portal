<?php
    include '../db_connection.php';
    session_start();
    header('Content-Type: application/json');

    if(!isset($_SESSION['is_admin'] ) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    
    $stmt = $conn->prepare("SELECT 
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM company) AS total_companies,
        (SELECT COUNT(*) FROM jobs) AS total_jobs,
        (SELECT COUNT(*) FROM job_applications) AS total_applications
    ");
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    echo json_encode($result);
?>