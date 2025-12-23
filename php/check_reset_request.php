<?php
require 'db_connection.php';
header('Content-Type: application/json');

$token = isset($_GET['token']) ? $_GET['token'] : '';

if (empty($token)) {
    echo json_encode(['success' => false, 'message' => 'Invalid or missing token']);
    exit();
}

$stmt = $conn->prepare('SELECT * FROM forget_password_requests WHERE token = ? AND used = FALSE AND expires_at > NOW()');
$stmt->bind_param('s', $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid or expired reset link']);
    exit();
}

$row = $result->fetch_assoc();
$expires_at = new DateTime($row['expires_at']);
$current_time = new DateTime();
$interval = $current_time->diff($expires_at);
$minutes_left = ($interval->h * 60) + $interval->i;

echo json_encode([
    'success' => true, 
    'message' => "Reset link is valid. You have $minutes_left minutes remaining to reset your password.",
    'token' => $token
]);
?>
