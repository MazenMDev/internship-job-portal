<?php
include 'db_connection.php';
session_start();
header('Content-Type: application/json');

if (isset($_GET['id'])) {
    $user_id = intval($_GET['id']);

    $session_id = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : null;

    $stmt = $conn->prepare("SELECT user_id AS Id, company_name, company_email, phone_number, street_address, city, state, zip_code, country, user_position, company_url , description FROM company WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $row['Id'] = intval($row['Id']);
        $row['is_owner'] = $session_id !== null && $session_id === $row['Id'];
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "User not found"]);
    }
} else {
    echo json_encode(["error" => "No ID provided"]);
}
?>