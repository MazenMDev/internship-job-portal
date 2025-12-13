<?php

session_start();
include 'db_connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_SESSION['type'] === 'user' ? $_SESSION['user_id'] : $_SESSION['company_id'];

    if (!isset($userId)) {
        echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
        exit;
    }

    $currentPassword = $_POST['current_password'];
    $newPassword = $_POST['new_password'];

    $table = '';
    $idColumn = '';
    $passwordColumn = '';
    if($_SESSION['type'] === 'user'){
        $table = 'users';
        $idColumn = 'Id';
        $passwordColumn = 'Password';
    } else {
        $table = 'company';
        $idColumn = 'company_id';
        $passwordColumn = 'password';
    }
    // get the current password from the database
    $stmt = $conn->prepare("SELECT $passwordColumn FROM $table WHERE $idColumn = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->bind_result($hashedPassword);
    $stmt->fetch();
    $stmt->close();
    // verify the current password
    if (password_verify($currentPassword, $hashedPassword)) {
        // hash the new password
        $newHashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        // change the password in the database
        $updateStmt = $conn->prepare("UPDATE $table SET $passwordColumn = ? WHERE $idColumn = ?");
        $updateStmt->bind_param("si", $newHashedPassword, $userId);
        if ($updateStmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Password changed successfully.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update password.']);
        }
        $updateStmt->close();
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Current password is incorrect.']);
    }
}
?>