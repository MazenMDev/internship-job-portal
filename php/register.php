<?php
// Database connection
include 'db_connection.php';
include 'includes/PHPMailer/sendMail.php';
header('Content-Type: application/json');

$fname = trim($_POST['fname']);
$lname = trim($_POST['lname']);
$email = trim($_POST['email']);
$password = $_POST['password'];
$confirm = $_POST['confirm'];
$gender = $_POST['gender'];

if ($password !== $confirm) {
    echo json_encode(["status" => "error", "message" => "Passwords do not match!"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format!"]);
    exit;
}

// Check if email already exists in users table
$checkMail = $conn->prepare("SELECT 1 FROM users WHERE Email = ?");
$checkMail->bind_param("s", $email);
$checkMail->execute();
$checkMail->store_result();

if ($checkMail->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already registered!"]);
    exit;
}
$checkMail->close();

// Check if email already has a pending verification
$checkPending = $conn->prepare("SELECT * FROM email_verifications WHERE Email = ? AND is_used = FALSE");
$checkPending->bind_param("s", $email);
$checkPending->execute();
$checkPending->store_result();

if ($checkPending->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "A verification email has already been sent to this address. Please check your inbox."]);
    exit;
}
$checkPending->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Generate verification token
$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

// Insert into email_verifications table
$query = $conn->prepare("
    INSERT INTO email_verifications (token, expires_at, First_Name, Last_Name, Email, Password, Gender)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");
$query->bind_param("sssssss", $token, $expiresAt, $fname, $lname, $email, $hashedPassword, $gender);

if (!$query->execute()) {
    echo json_encode(["status" => "error", "message" => "Error: " . $query->error]);
    exit;
}
$query->close();

// Send verification email
$verificationLink = "http://" . $_SERVER['HTTP_HOST'] . "/php/verify_email.php?token=" . urlencode($token);
$subject = 'Verify Your Email Address';
$currentYear = date('Y');
$body = "
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #009aab 0%, #007a87 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }
        .content h2 {
            color: #009aab;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .content p {
            color: #555;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #009aab 0%, #007a87 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(0, 154, 171, 0.3);
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 154, 171, 0.4);
        }
        .link-box {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #009aab;
            margin: 20px 0;
            word-break: break-all;
            font-size: 14px;
            color: #666;
        }
        .warning-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .warning-box p {
            color: #856404;
            margin: 0;
            font-size: 14px;
        }
        .footer {
            background-color: #f8f9fa;
            text-align: center;
            padding: 30px 20px;
            border-top: 1px solid #e0e0e0;
        }
        .footer p {
            color: #888;
            font-size: 13px;
            margin: 5px 0;
        }
        .footer .year {
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class='email-wrapper'>
        <div class='header'>
            <h1>Welcome to JobConnect!</h1>
        </div>
        <div class='content'>
            <h2>Hello $fname $lname, this is Kareem from JobConnect.</h2>
            <p>Thank you for joining JobConnect! We're excited to have you on board.</p>
            <p>To complete your registration and start exploring job opportunities, please verify your email address by clicking the button below:</p>
            
            <div class='button-container'>
                <a href='$verificationLink' class='button'>Verify Email Address</a>
            </div>
            
            <p style='text-align: center; color: #888; font-size: 14px;'>Or copy and paste this link into your browser:</p>
            <div class='link-box'>$verificationLink</div>
            
            <div class='warning-box'>
                <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
            </div>
            
            <p style='font-size: 14px; color: #888; margin-top: 30px;'>If you did not create an account with JobConnect, please ignore this email or contact our support team.</p>
        </div>
        <div class='footer'>
            <p>&copy; <span class='year' id='year'>$currentYear</span> JobConnect. All rights reserved.</p>
            <p>Connecting talent with opportunities</p>
        </div>
    </div>
    <script>
        document.getElementById('year').textContent = new Date().getFullYear() || 2025;
    </script>
</body>
</html>
";
$altBody = "Hello $fname $lname,\n\nThank you for registering with JobConnect!\n\nTo complete your registration, please verify your email by visiting:\n$verificationLink\n\nThis link will expire in 24 hours.\n\nIf you did not create an account, please ignore this email.\n\n© $currentYear JobConnect. All rights reserved.";

$result = sendMail($email, $subject, $body, $altBody);

if ($result['success']) {
    echo json_encode(["status" => "success", "message" => "Registration successful! Please check your email to verify your account."]);
} else {
    echo json_encode(["status" => "error", "message" => "Registration successful but email could not be sent. " . $result['message']]);
}

$conn->close();
?>