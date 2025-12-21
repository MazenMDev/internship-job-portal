<?php
include 'db_connection.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['type'])) {
    echo json_encode(['error' => 'Please log in to access this page.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($_SESSION['company_id'])) {
        echo json_encode(["success" => false, "error" => "Unauthorized session."]);
        exit;
    }

    $company_id = intval($_SESSION['company_id']);

    $stmt = $conn->prepare("UPDATE company SET 
            company_name = ?, 
            description = ?, 
            phone_number = ?, 
            company_url = ?, 
            country = ?, 
            city = ?, 
            state = ?, 
            street_address = ?, 
            zip_code = ? 
            WHERE company_id = ?");

    $stmt->bind_param(
        "sssssssssi",
        $data['company_name'],
        $data['description'],
        $data['phone_number'],
        $data['company_url'],
        $data['country'],
        $data['city'],
        $data['state'],
        $data['street_address'],
        $data['zip_code'],
        $company_id
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
    exit;
}

if (isset($_GET['id'])) {
    $company_id = intval($_GET['id']);
    $session_id = isset($_SESSION['company_id']) ? intval($_SESSION['company_id']) : null;
    $stmt = $conn->prepare("SELECT company_id, company_name, company_email, phone_number, description, company_url, street_address, city, state, zip_code, country, image FROM company WHERE company_id = ?");
    $stmt->bind_param("i", $company_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $row['company_id'] = intval($row['company_id']);
        $row['is_owner'] = $session_id !== null && $session_id === $row['company_id'];
        echo json_encode($row);
    } else {
        echo json_encode(["error" => "Company not found"]);
    }
} else {
    echo json_encode(["error" => "No company ID provided"]);
}
?>