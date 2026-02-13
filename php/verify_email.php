<?php
include 'db_connection.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    die("Invalid verification link.");
}

$stmt = $conn->prepare("
    SELECT * FROM email_verifications 
    WHERE token = ? AND is_used = FALSE
");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Invalid or already used link.");
}

$verification = $result->fetch_assoc();

if (date('Y-m-d H:i:s') > $verification['expires_at']) {
    die("Verification link expired.");
}

$conn->begin_transaction();

try {

    $insertUser = $conn->prepare("
        INSERT INTO users 
        (First_Name, Last_Name, Email, Password, Gender)
        VALUES (?, ?, ?, ?, ?)
    ");

    $insertUser->bind_param(
        "sssss",
        $verification['First_Name'],
        $verification['Last_Name'],
        $verification['Email'],
        $verification['Password'],
        $verification['Gender']
    );

    $insertUser->execute();
    $insertUser->close();

    $markUsed = $conn->prepare("
        UPDATE email_verifications 
        SET is_used = TRUE 
        WHERE id = ?
    ");

    $markUsed->bind_param("i", $verification['id']);
    $markUsed->execute();
    $markUsed->close();

    $conn->commit();
    echo "Email verified successfully!";

} catch (Exception $e) {
    $conn->rollback();
    echo "Verification failed.";
}

$conn->close();
?>

