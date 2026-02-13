<?php
    include '../db_connection.php';
    session_start();
    header('Content-Type: application/json');

    if(!isset($_SESSION['is_admin'] ) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }   
    
    // Get companies under admin verification
    // Join verify_company to get the verification_id for admin
    $stmt = $conn->prepare("
        SELECT 
            vc.verification_id,
            vc.is_verified,
            vc.created_at as verification_created_at,
            c.company_id,
            c.company_name,
            c.company_email,
            c.phone_number,
            c.street_address,
            c.city,
            c.state,
            c.zip_code,
            c.country,
            c.company_url,
            c.description,
            c.created_at
        FROM verify_company vc
        INNER JOIN company c ON vc.company_id = c.company_id
        WHERE c.company_verified = 1
        ORDER BY vc.created_at DESC
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $companies = [];
    while($row = $result->fetch_assoc()) {
        $companies[] = $row;
    }
    $stmt->close();

    echo json_encode($companies);
?>