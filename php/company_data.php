<?php
    include './db_connection.php';
    header('Content-Type: application/json');
    session_start();
    
    if(!isset($_SESSION['user_id'])) {
        echo json_encode(["error" => "User not logged in"]);
        exit();
    };
    if($_SESSION['type'] !== 'company') {
        echo json_encode(["error" => "Only companies can access this data"]);
        exit();
    }

    $company_id = $_SESSION['company_id'];
    $stmt = $conn->prepare("SELECT company_name, description, company_url, user_id , country , city FROM company WHERE user_id = ?");
    $stmt->bind_param("i", $company_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $companyData = $result->fetch_assoc();
    echo json_encode($companyData);
?>