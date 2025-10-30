<?php
// Database connection
$conn = new mysqli("localhost", "root", "", "jobconnect-cs283project");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$fname = $_POST['fname'];
$lname = $_POST['lname'];
$email = $_POST['email'];
$password = $_POST['password'];
$confirm = $_POST['confirm'];
$gender = $_POST['gender'];
$isCompany = 0; // Default 0 for regular users

if ($password !== $confirm) {
  die("Passwords do not match!");
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  die("Invalid email format!");
}

$emailExistsQuery = "SELECT * FROM users WHERE Email='$email'";
$result = $conn->query($emailExistsQuery);
if ($result->num_rows > 0) {
  die("Email already registered!");
}

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert into database
$sql = "INSERT INTO users (First_Name, Last_Name, Email, Password, Gender , is_Company) 
        VALUES ('$fname', '$lname', '$email', '$hashedPassword', '$gender', '$isCompany')";

if ($conn->query($sql) === TRUE) {
  echo "Registration successful!";
  
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>