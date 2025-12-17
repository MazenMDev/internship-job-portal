<?php
    include '../db_connection.php';
    session_start();
    header('Content-Type: application/json');


      if(!isset($_SESSION['is_admin'] ) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }   

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
       $message_id = $_POST['message_id'];
       $stmt = $conn->prepare("DELETE FROM contact_us WHERE message_id = ?"); 
       $stmt->bind_param("i", $message_id);

       if($stmt->execute()){
            echo json_encode(['success' => 'true', 'message' => 'Message deleted successfully']);
       } else {
            echo json_encode(['success' => 'false', 'message' => 'Failed to delete message']);
       }

       $stmt->close();


    } else {
        echo json_encode(['success' => 'false', 'message' => 'Invalid request method']);
    }
?>