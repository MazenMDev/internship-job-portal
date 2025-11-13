<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "logged_in" => true,
        "user_id" => $_SESSION['user_id'],
        "email" => $_SESSION['email'],
        "first_name" => $_SESSION['first_name'],
        "last_name" => $_SESSION['last_name'],
        "title" => $_SESSION['title'],
        "theme" => $_SESSION['theme'],
        "image" => $_SESSION['image'],
        "is_admin" => $_SESSION['is_admin']
    ]);
} else {
    echo json_encode(["logged_in" => false]);
}
?>
