<?php
require 'db_connection.php';

session_start();
header('Content-Type: application/json');

$token = $_POST['token'] ?? '';
$new_password = $_POST['new_password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';

if (empty($token) || empty($new_password) || empty($confirm_password)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

if ($new_password !== $confirm_password) {
    echo json_encode(['status' => 'error', 'message' => 'Passwords do not match.']);
    exit;
}

// Password validation
if (strlen($new_password) < 8) {
    echo json_encode(['status' => 'error', 'message' => 'Password must be at least 8 characters long.']);
    exit;
}

if (!preg_match('/[A-Z]/', $new_password)) {
    echo json_encode(['status' => 'error', 'message' => 'Password must contain at least one uppercase letter.']);
    exit;
}

if (!preg_match('/[a-z]/', $new_password)) {
    echo json_encode(['status' => 'error', 'message' => 'Password must contain at least one lowercase letter.']);
    exit;
}

if (!preg_match('/[0-9]/', $new_password)) {
    echo json_encode(['status' => 'error', 'message' => 'Password must contain at least one digit.']);
    exit;
}

if (preg_match('/[<>\/\\\\\'"]/', $new_password)) {
    echo json_encode(['status' => 'error', 'message' => 'Password contains invalid characters.']);
    exit;
}

if (strpos($new_password, ' ') !== false) {
    echo json_encode(['status' => 'error', 'message' => 'Password cannot contain spaces.']);
    exit;
}

$stmt = $conn->prepare("
    SELECT id, user_id, company_id, change_type, token,
           new_email, new_email_token, new_email_verified,
           old_email_verified, created_at, expires_at, is_used,
           CASE WHEN user_id IS NOT NULL THEN 'user' ELSE 'company' END as account_type
    FROM account_change_requests
    WHERE token = ?
");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid or expired verification link.']);
    exit;
}

$request = $result->fetch_assoc();

if ($request['is_used']) {
    echo json_encode(['status' => 'error', 'message' => 'This verification link has already been used.']);
    exit;
}

if (strtotime($request['expires_at']) < time()) {
    echo json_encode(['status' => 'error', 'message' => 'This verification link has expired.']);
    exit;
}

if (!$request['old_email_verified']) {
    echo json_encode(['status' => 'error', 'message' => 'Email verification is required before changing password.']);
    exit;
}

if ($request['change_type'] !== 'password') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid verification link.']);
    exit;
}

$account_type = $request['account_type'];
$user_id = $request['user_id'];
$company_id = $request['company_id'];

$hashed_password = password_hash($new_password, PASSWORD_BCRYPT);

if ($account_type === 'user') {
    $stmt = $conn->prepare("UPDATE users SET Password = ? WHERE Id = ?");
    $stmt->bind_param("si", $hashed_password, $user_id);
} else {
    $stmt = $conn->prepare("UPDATE company SET password = ? WHERE company_id = ?");
    $stmt->bind_param("si", $hashed_password, $company_id);
}

if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update password.']);
    exit;
}

$stmt = $conn->prepare("UPDATE account_change_requests SET is_used = TRUE WHERE token = ?");
$stmt->bind_param("s", $token);

if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update request status.']);
    exit;
}

echo json_encode(['status' => 'success', 'message' => 'Your password has been changed successfully.']);
exit;
?>
