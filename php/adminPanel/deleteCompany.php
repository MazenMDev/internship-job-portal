<?php
    include '../db_connection.php';
    session_start();
    header('Content-Type: application/json');

    
    if(!isset($_SESSION['is_admin'] ) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }   

    if(!isset($_POST['company_id'])) {
        echo json_encode(['error' => 'Company ID not provided']);
        exit;
    }

    $company_id = $_POST['company_id'];

    $stmt = $conn->prepare("DELETE FROM company WHERE company_id = ?");
    $stmt->bind_param("i", $company_id);

    if($stmt->execute()){
        echo json_encode([
            'success' => true,
            'message' => 'Company deleted successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to delete company'
        ]);
    }
?>