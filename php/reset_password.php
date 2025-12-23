<?php
require 'db_connection.php';
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit();
}

$token = isset($_POST['token']) ? $_POST['token'] : '';
$new_password = isset($_POST['password']) ? $_POST['password'] : '';
$confirm_password = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

if (empty($token) || empty($new_password) || empty($confirm_password)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit();
}

if ($new_password !== $confirm_password) {
    echo json_encode(['status' => 'error', 'message' => 'Passwords do not match']);
    exit();
}

if (strlen($new_password) < 8) {
    echo json_encode(['status' => 'error', 'message' => 'Password must be at least 8 characters long']);
    exit();
}

$stmt = $conn->prepare('SELECT * FROM forget_password_requests WHERE token = ? AND used = FALSE AND expires_at > NOW()');
$stmt->bind_param('s', $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid or expired reset link']);
    exit();
}

$row = $result->fetch_assoc();
$user_id = $row['user_id'];
$company_id = $row['company_id'];

$hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

if ($user_id !== null) {
    $stmt = $conn->prepare('UPDATE users SET Password = ? WHERE Id = ?');
    $stmt->bind_param('si', $hashed_password, $user_id);
} else if ($company_id !== null) {
    $stmt = $conn->prepare('UPDATE company SET company_password = ? WHERE company_id = ?');
    $stmt->bind_param('si', $hashed_password, $company_id);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid reset request']);
    exit();
}

if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update password']);
    exit();
}

$stmt = $conn->prepare('UPDATE forget_password_requests SET used = TRUE WHERE token = ?');
$stmt->bind_param('s', $token);
$stmt->execute();

echo json_encode(['status' => 'success', 'message' => 'Password reset successfully. You can now login with your new password.']);
?>
