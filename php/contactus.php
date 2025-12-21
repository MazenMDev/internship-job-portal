<?php

include './db_connection.php';

session_start();
header('Content-Type: application/json');

$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';
$first_name = $_POST['first_name'] ?? $_POST['firstname'] ?? '';
$last_name = $_POST['last_name'] ?? $_POST['lastname'] ?? '';
$user_id = null;
$sql = '';
$stmt = null;

if (isset($_SESSION['type'])) {


    if ($_SESSION['type'] === 'user') {
        $user_id = $_SESSION['user_id'];

        $sql = "INSERT INTO contact_us (email, message, user_Id, first_name, last_name)
        VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssiss", $email, $message, $user_id, $first_name, $last_name);

    } else if ($_SESSION['type'] === 'company') {
        $company_id = $_SESSION['company_id'];
        $sql = "INSERT INTO contact_us (email, message, company_id, first_name, last_name)
            VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssiss", $email, $message, $company_id, $first_name, $last_name);
    }

} else {
    $sql = "INSERT INTO contact_us (email, message, first_name, last_name)
        VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $email, $message, $first_name, $last_name);
}

if ($stmt && $stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "we have received your message!"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => $stmt ? $stmt->error : $conn->error
    ]);
}