<?php

include 'db_connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $userid= $_SESSION['user_id'];
    $email= $_POST['email'];

    
    $currentpassword=$_POST['current_password'];
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->bind_result($hashedPassword);
    $stmt->fetch();
    $stmt->close();


    if (!password_verify($currentPassword, $hashedPassword)) {
        
        echo json_encode(['status' => 'error', 'message' => 'Password is incorrect.']);
        
    exit;
    }

    $stmt = $conn->prepare("UPDATE users SET Email =? WHERE Id =?  ");
    $stmt->bind_param("si", $email , $userid);


    if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Email changed successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to change Email.']);
        }
    $stmt->close();

    }

    
?>