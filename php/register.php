<?php
// Database connection

include 'db_connection.php';
header('Content-Type: application/json');

$fname = trim($_POST['fname']);
$lname = trim($_POST['lname']);
$email = trim($_POST['email']);
$password = $_POST['password'];
$confirm = $_POST['confirm'];
$gender = $_POST['gender'];
$theme = "light";

if ($password !== $confirm) {
    echo json_encode(["status" => "error", "message" => "Passwords do not match!"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format!"]);
    exit;
}

$checkMail = $conn->prepare("SELECT 1 FROM users WHERE Email = ?");
$checkMail->bind_param("s", $email);
$checkMail->execute();
$checkMail->store_result();

if ($checkMail->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already registered!"]);
    exit;
}

$checkMail->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into database
$query = $conn->prepare("
    INSERT INTO users (First_Name, Last_Name, Email, Password, Gender, theme)
    VALUES (?, ?, ?, ?, ?, ?)
");
$query->bind_param("ssssss", $fname, $lname, $email, $hashedPassword, $gender, $theme);

if ($query->execute()) {
    echo json_encode(["status" => "success", "message" => "Registration successful!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $query->error]);
}

$query->close();
$conn->close();
?>
