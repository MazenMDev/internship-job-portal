<?php
session_start();
include 'db_connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Please fill in all fields."]);
    exit;
}

$stmt = $conn->prepare("SELECT company_id, company_name, password , theme, Image FROM company WHERE company_email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$companyResult = $stmt->get_result();
$isCompanyEmail = $companyResult->num_rows > 0;
$stmt->close();

if ($isCompanyEmail) {
    $company = $companyResult->fetch_assoc();
    if (password_verify($password, $company['password'])) {
        $_SESSION['logged_in'] = true;
        $_SESSION['company_id'] = $company['company_id'];
        $_SESSION['company_name'] = $company['company_name'];
        $_SESSION['company_email'] = $email;
        $_SESSION['theme'] = $company['theme'];
        $_SESSION['is_company'] = true;
        $_SESSION['is_admin'] = false;
        $_SESSION['type'] = 'company';
        $_SESSION['image'] = $company['Image'];
        
        echo json_encode([
            "status" => "success",
            "message" => "Company login successful!",
            "redirect" => "../pages/landing.html",
            "type" => "company"
        ]);
        exit;
    }
    echo json_encode(["status" => "error", "message" => "Incorrect company email or password."]);
    exit;
}

$stmt = $conn->prepare("SELECT Id, Password, First_Name, Last_Name, Title, Image, is_admin, theme FROM users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "User not found."]);
    exit;
}

$user = $result->fetch_assoc();
if (!password_verify($password, $user['Password'])) {
    echo json_encode(["status" => "error", "message" => "Incorrect password."]);
    exit;
}

$_SESSION['logged_in'] = true;
$_SESSION['user_id'] = $user['Id'];
$_SESSION['email'] = $email;
$_SESSION['first_name'] = $user['First_Name'];
$_SESSION['last_name'] = $user['Last_Name'];
$_SESSION['title'] = $user['Title'];
$_SESSION['theme'] = $user['theme'];
$_SESSION['image'] = $user['Image'];
$_SESSION['is_admin'] = $user['is_admin'];
$_SESSION['is_company'] = false;
$_SESSION['type'] = 'user';

echo json_encode([
    "status" => "success",
    "message" => "Login successful!",
    "redirect" => "../pages/landing.html",
    "type" => "user"
]);

$stmt->close();
$conn->close();
?>
