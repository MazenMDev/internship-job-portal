<?php
    include './db_connection.php';
    header('Content-Type: application/json');
    session_start();
    
    if(!isset($_SESSION['user_id'])) {
        echo json_encode(["error" => "User not logged in"]);
        exit();
    };

    $user_id = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT company_name, description, company_url, user_id , country , city FROM company WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $companyData = $result->fetch_assoc();
    echo json_encode($companyData);
?>