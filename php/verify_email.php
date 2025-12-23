<?php
include 'db_connection.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("Invalid verification link."));
    exit;
}

$stmt = $conn->prepare("
    SELECT id, First_Name, Last_Name, Email, Password, Gender, expires_at, is_used 
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

$checkEmail = $conn->prepare("SELECT 1 FROM users WHERE Email = ?");
$checkEmail->bind_param("s", $verification['Email']);
$checkEmail->execute();
$checkEmail->store_result();

if ($checkEmail->num_rows > 0) {
    $checkEmail->close();
    
    // Mark as used
    $markUsed = $conn->prepare("UPDATE email_verifications SET is_used = TRUE WHERE id = ?");
    $markUsed->bind_param("i", $verification['id']);
    $markUsed->execute();
    $markUsed->close();
    
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("This email is already registered. Please login."));
    exit;
}
$checkEmail->close();

$conn->begin_transaction();

try {
    $theme = "light";
    $insertUser = $conn->prepare("
        INSERT INTO users (First_Name, Last_Name, Email, Password, Gender, theme)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $insertUser->bind_param(
        "ssssss",
        $verification['First_Name'],
        $verification['Last_Name'],
        $verification['Email'],
        $verification['Password'],
        $verification['Gender'],
        $theme
    );
    
    if (!$insertUser->execute()) {
        throw new Exception("Failed to create user account.");
    }
    $insertUser->close();
    
    $markUsed = $conn->prepare("UPDATE email_verifications SET is_used = TRUE WHERE id = ?");
    $markUsed->bind_param("i", $verification['id']);
    
    if (!$markUsed->execute()) {
        throw new Exception("Failed to update verification status.");
    }
    $markUsed->close();
    
    $conn->commit();
    $conn->close();
    
    header("Location: ../pages/verification-result.html?status=success&message=" . urlencode("Email verified successfully! You can now login."));
    exit;
    
} catch (Exception $e) {
    $conn->rollback();
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("Verification failed. Please try again."));
    exit;
}
?>
