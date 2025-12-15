<?php
    include '../db_connection.php';
    session_start();
    header('Content-Type: application/json');

    if(!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $verif_id = $_POST['company_id'];
    $status = $_POST['status'];

    if($status == 1){
        $stmt = $conn->prepare("SELECT * FROM verify_company WHERE verification_id = ?");
        $stmt->bind_param("i", $verif_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $company = $result->fetch_assoc();
        $stmt->close();

        if (!$company) {
            echo json_encode(['error' => 'Company not found']);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO company (company_name, company_email, password, phone_number, street_address, city, state, zip_code, country, company_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssss", $company['company_name'], $company['company_email'], $company['password'], $company['company_phone'], $company['company_address'], $company['company_city'], $company['company_state'], $company['company_zip'], $company['company_country'], $company['company_website']);

        if ($stmt->execute()) {
            $stmt->close();
            $stmt = $conn->prepare("DELETE FROM verify_company WHERE verification_id = ?");
            $stmt->bind_param("i", $verif_id);
            $stmt->execute();
            $stmt->close();
            echo json_encode(['success' => true, 'message' => 'Company verified and registered successfully']);
        } else {
            echo json_encode(['error' => 'Failed to register company']);
        }

    } elseif ($status == 2) {
        $stmt = $conn->prepare("DELETE FROM verify_company WHERE verification_id = ?");
        $stmt->bind_param("i", $verif_id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Company rejected successfully']);
        } else {
            echo json_encode(['error' => 'Failed to reject company']);
        }
        $stmt->close();
    }
?>