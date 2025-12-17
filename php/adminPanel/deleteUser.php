<?php
    include '../db_connection.php';
    session_start();
    header('Content-Type: application/json');

    
    if(!isset($_SESSION['is_admin'] ) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }   

    if(!isset($_POST['user_id'])) {
        echo json_encode(['error' => 'User ID not provided']);
        exit;
    }

    $user_id = $_POST['user_id'];

    $stmt = $conn->prepare("DELETE FROM users WHERE Id = ?");
    $stmt->bind_param("i", $user_id);

    if($stmt->execute()){
        echo json_encode([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to delete user'
        ]);
    }
?>