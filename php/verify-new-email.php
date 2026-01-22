<?php
require 'db_connection.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    header('Location: /pages/account-change-verify.html?status=error&message=' . urlencode('Invalid verification link.'));
    exit;
}

$stmt = $conn->prepare("
    SELECT id, user_id, company_id, change_type, token, 
           new_email, new_email_token, new_email_verified, 
           old_email_verified, created_at, expires_at, is_used,
           CASE WHEN user_id IS NOT NULL THEN 'user' ELSE 'company' END as account_type
    FROM account_change_requests
    WHERE new_email_token = ?
");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header('Location: /pages/account-change-verify.html?status=error&message=' . urlencode('Invalid or expired verification link.'));
    exit;
}

$request = $result->fetch_assoc();

if ($request['is_used']) {
    header('Location: /pages/account-change-verify.html?status=error&message=' . urlencode('This verification link has already been used.'));
    exit;
}

if (strtotime($request['expires_at']) < time()) {
    header('Location: /pages/account-change-verify.html?status=error&message=' . urlencode('This verification link has expired.'));
    exit;
}

if (!$request['old_email_verified']) {
    header('Location: /pages/account-change-verify.html?status=error&message=' . urlencode('The original email address has not been verified yet. Please verify from your current email first.'));
    exit;
}

if ($request['change_type'] !== 'email') {
    header('Location: /pages/account-change-verify.html?status=error&message=' . urlencode('Invalid verification link.'));
    exit;
}

$new_email = $request['new_email'];
$account_type = $request['account_type'];
$user_id = $request['user_id'];
$company_id = $request['company_id'];

if ($account_type === 'user') {
    $stmt = $conn->prepare("UPDATE users SET Email = ? WHERE Id = ?");
    $stmt->bind_param("si", $new_email, $user_id);
} else {
    $stmt = $conn->prepare("UPDATE company SET company_email = ? WHERE company_id = ?");
    $stmt->bind_param("si", $new_email, $company_id);
}

if (!$stmt->execute()) {
    header('Location: /pages/account-change-verify.html?status=error&message=' . urlencode('Failed to update email.'));
    exit;
}

// Mark the request as used and new email verified
$stmt = $conn->prepare("UPDATE account_change_requests SET is_used = TRUE, new_email_verified = TRUE WHERE new_email_token = ?");
$stmt->bind_param("s", $token);

if (!$stmt->execute()) {
    header('Location: /pages/account-change-verify.html?status=error&message=' . urlencode('Failed to update request status.'));
    exit;
}

header('Location: /pages/account-change-verify.html?status=success&type=email&message=' . urlencode('Your email has been successfully changed to ' . $new_email . '. Please login with your new email address.'));
exit;
?>
