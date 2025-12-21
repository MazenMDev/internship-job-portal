<?php
session_start();
include 'db_connection.php';
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {

    $stmt = $conn->prepare("SELECT COUNT(*) AS unread_count FROM notifications WHERE receiver_type = 1 AND receiver_id = ? AND seen = 0");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $notifResult = $stmt->get_result();
    $notifData = $notifResult->fetch_assoc();
    $unread_count = $notifData['unread_count'];
    $stmt->close();

    echo json_encode([
        "logged_in" => true,
        "user_id" => $_SESSION['user_id'],
        "email" => $_SESSION['email'],
        "first_name" => $_SESSION['first_name'],
        "last_name" => $_SESSION['last_name'],
        "title" => $_SESSION['title'],
        "theme" => $_SESSION['theme'],
        "image" => $_SESSION['image'],
        "is_admin" => $_SESSION['is_admin'],
        "is_company" => false,
        "type" => "user",
        "cv" => $_SESSION['cv'],
        "unread_notifications" => $unread_count
    ]);
} else if (isset($_SESSION['company_id'])) {

    $stmt = $conn->prepare("SELECT COUNT(*) AS unread_count FROM notifications WHERE receiver_type = 2 AND receiver_id = ? AND seen = 0");
    $stmt->bind_param("i", $_SESSION['company_id']);
    $stmt->execute();
    $notifResult = $stmt->get_result();
    $notifData = $notifResult->fetch_assoc();
    $unread_count = $notifData['unread_count'];
    $stmt->close();

    echo json_encode([
        "logged_in" => true,
        "company_id" => $_SESSION['company_id'],
        "company_name" => $_SESSION['company_name'],
        "company_email" => $_SESSION['company_email'],
        "theme" => $_SESSION['theme'],
        "is_admin" => false,
        "is_company" => true,
        "image" => $_SESSION['image'],
        "type" => "company",
        "unread_notifications" => $unread_count
    ]);
} else {
    echo json_encode(["logged_in" => false]);
}

$conn->close();
?>