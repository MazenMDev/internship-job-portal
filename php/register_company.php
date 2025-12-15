<?php
include 'db_connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$company_name = trim($_POST['name'] ?? '');
$company_email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirmPassword'] ?? '';
$company_phone = trim($_POST['number'] ?? '');
$company_address = trim($_POST['street-address'] ?? '');
$company_city = trim($_POST['city'] ?? '');
$company_state = trim($_POST['state'] ?? '');
$company_zip = trim($_POST['postal'] ?? '');
$company_country = trim($_POST['country'] ?? '');
$company_link = trim($_POST['link'] ?? '');

if (empty($company_name) || empty($company_email) || empty($password) || empty($company_phone) || 
    empty($company_address) || empty($company_city) || empty($company_state) || 
    empty($company_zip) || empty($company_country) || empty($company_link)) {
    echo json_encode(["status" => "error", "message" => "Please fill in all required fields."]);
    exit;
}

if ($password !== $confirm_password) {
    echo json_encode(["status" => "error", "message" => "Passwords do not match."]);
    exit;
}

$stmt = $conn->prepare("SELECT company_id FROM company WHERE company_email = ?");
$stmt->bind_param("s", $company_email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already registered."]);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO verify_company (company_name, company_email, password, company_phone, company_address, company_city, company_state, company_zip, company_country, company_website) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssssss", $company_name, $company_email, $hashed_password, $company_phone, $company_address, $company_city, $company_state, $company_zip, $company_country, $company_link);
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Registration successful. Please allow up to 3 working days for verification."]);
} else {
    echo json_encode(["status" => "error", "message" => "Registration failed. Please try again."]);
}
$stmt->close();
$conn->close();
?>
