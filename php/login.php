<?php
session_start();
include 'db_connection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Database connection


$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Please fill in all fields."]);
    exit;
}

// Check if user exists
$stmt = $conn->prepare("SELECT Id, Password, First_Name, Last_Name, Title , Image , is_admin, theme FROM users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Incorrect email or password."]);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['Password'])) {
    echo json_encode(["status" => "error", "message" => "Incorrect password."]);
    exit;
}

// Login successful — set session
$_SESSION['user_id'] = $user['Id'];
$_SESSION['email'] = $email;
$_SESSION['first_name'] = $user['First_Name'];
$_SESSION['last_name'] = $user['Last_Name'];
$_SESSION['is_admin'] = $user['is_admin'];
$_SESSION['title'] = $user['Title'];
$_SESSION['theme'] = $user['theme'];
$_SESSION['image'] = $user['Image'];

echo json_encode([
    "status" => "success",
    "message" => "Login successful!",
    "redirect" => "../pages/landing.html"
]);

$stmt->close();
$conn->close();
?>
