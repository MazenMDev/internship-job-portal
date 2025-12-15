<?php
    include '../db_connection.php';
    session_start();
    header('Content-Type: application/json');

    if(!isset($_SESSION['is_admin'] ) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }   
    
    $stmt = $conn->prepare("SELECT * FROM verify_company WHERE is_verified = 0");
    $stmt->execute();
    $result = $stmt->get_result();
    $companies = [];
    while($row = $result->fetch_assoc()) {
        $companies[] = $row;
    }
    echo json_encode($companies);
?>