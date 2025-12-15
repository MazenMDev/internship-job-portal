<?php
    include '../db_connection.php';
    session_start();
    header('Content-Type: application/json');
    if(!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    $stmt = $conn->prepare("SELECT * FROM contact_us ORDER BY created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    $messages = [];
    while($row = $result->fetch_assoc()) {
        $messages[] = $row;
    }
    echo json_encode($messages);
    
?>