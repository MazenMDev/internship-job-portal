<?php
    include 'db_connection.php';
    header('Content-Type: application/json');
    session_start();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
        exit;
    }
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
        exit;
    }
    $user_id = $_SESSION['user_id'];
    $company_name = trim($_POST['name'] ?? '');
    $company_email = trim($_POST['email'] ?? '');
    $company_phone = trim($_POST['number'] ?? '');
    $company_address = trim($_POST['street-address'] ?? '');
    $company_city = trim($_POST['city'] ?? '');
    $company_state = trim($_POST['state'] ?? '');
    $company_zip = trim($_POST['postal'] ?? '');
    $company_country = trim($_POST['country'] ?? '');
    $user_role = trim($_POST['position'] ?? '');
    $company_link = trim($_POST['link'] ?? '');

    if (empty($company_name) || empty($company_email) || empty($company_phone) || empty($company_address) || empty($company_city) || empty($company_state) || empty($company_zip) || empty($company_country) || empty($user_role)) {
        echo json_encode(["status" => "error", "message" => "Please fill in all required fields."]);
        exit;
    }
    
    $query = "SELECT user_id FROM company WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Company already registered for this user."]);
        exit;
    }


    $stmt = $conn->prepare("INSERT INTO company (user_id, company_name, company_email, phone_number, street_address, city, state, zip_code, country, user_position, company_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssssssss", $user_id, $company_name, $company_email, $company_phone, $company_address, $company_city, $company_state, $company_zip, $company_country, $user_role, $company_link);
    if ($stmt->execute()) {
        $_SESSION['is_company'] = true;
        echo json_encode(["status" => "success", "message" => "Company registered successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to register company."]);
    }
    $stmt->close();
    $conn->close();
?>