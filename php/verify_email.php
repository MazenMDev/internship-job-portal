<?php
include 'db_connection.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("Invalid verification link."));
    exit;
}

$stmt = $conn->prepare("
    SELECT id , user_id , is_used, expires_at
    FROM email_verifications 
    WHERE token = ?
");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("Invalid or expired verification link."));
    exit;
}

$verification = $result->fetch_assoc();
$stmt->close();

if ($verification['is_used']) {
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("This verification link has already been used."));
    exit;
}

$currentTime = date('Y-m-d H:i:s');
if ($currentTime > $verification['expires_at']) {
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("This verification link has expired. Please register again."));
    exit;
}

$checkEmail = $conn->prepare("SELECT * FROM users WHERE Id = ?");
$checkEmail->bind_param("i", $verification['user_id']);
$checkEmail->execute();
$checkEmail->store_result();

if ($checkEmail->num_rows > 0) {
    $checkEmail->close();
    
    // Mark as used
    $markUsed = $conn->prepare("UPDATE email_verifications SET is_used = TRUE WHERE id = ?");
    $markUsed->bind_param("i", $verification['id']);
    $markUsed->execute();
    $markUsed->close();
    
    // Update user's email_verified status
    $updateUser = $conn->prepare("UPDATE users SET email_verified = 1 WHERE Id = ?");
    $updateUser->bind_param("i", $verification['user_id']);
    $updateUser->execute();
    $updateUser->close();
    
    $conn->close();
    header("Location: ../pages/verification-result.html?status=success&message=" . urlencode("Your email has been successfully verified. You can now log in."));
    exit;
} else {
    $checkEmail->close();
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("User not found. Please register again."));
    exit;
}
?>