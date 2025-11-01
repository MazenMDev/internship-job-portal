<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "logged_in" => true,
        "user_id" => $_SESSION['user_id'],
        "email" => $_SESSION['email'],
        "first_name" => $_SESSION['first_name'],
        "is_company" => $_SESSION['is_company']
    ]);
} else {
    echo json_encode(["logged_in" => false]);
}
?>
