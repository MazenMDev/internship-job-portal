<?php
    include './db_connection.php';
    session_start();
    header('Content-Type: application/json');
    $user_id = $_SESSION['user_id'] ?? null;
    if (!$user_id) {
        echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
        exit;
    }
    
    $email = $_POST['email'] ?? '';
    $current_password = $_POST['current_password'] ?? '';
    if (empty($email) || empty($current_password)) {
        echo json_encode(['status' => 'error', 'message' => 'Email and current password are required.']);
        exit;
    }
    # Fetch the current password hash from the database
    $stmt = $conn->prepare("SELECT Password FROM users WHERE Id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        exit;
    }
    $row = $result->fetch_assoc();
    $hashed_password = $row['Password'];
    # Verify the current password
    if (!password_verify($current_password, $hashed_password)) {
        echo json_encode(['status' => 'error', 'message' => 'Current password is incorrect.']);
        exit;
    }
    # Update the email in the database
    $stmt = $conn->prepare("UPDATE users SET Email = ? WHERE Id = ?");
    $stmt->bind_param("si", $email, $user_id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Email updated successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update email.']);
    }
?>