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

$checkMail = $conn->prepare("SELECT Id, email_verified FROM users WHERE Email = ?");
$checkMail->bind_param("s", $email);
$checkMail->execute();
$result = $checkMail->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $existing_user_id = $row['Id'];
   
    if($row['email_verified'] == 1){
        $checkMail->close();
        echo json_encode(["status" => "error", "message" => "Email already registered! Please login instead."]);
        exit;
    }
    
    if($row['email_verified'] == 0){
        $checkMail->close();
        
        $checkPending = $conn->prepare("SELECT id, expires_at FROM email_verifications WHERE user_id = ? AND is_used = FALSE ORDER BY created_at DESC LIMIT 1");
        $checkPending->bind_param("i", $existing_user_id);
        $checkPending->execute();
        $pendingResult = $checkPending->get_result();
        
        if ($pendingResult->num_rows > 0) {
            $pendingRow = $pendingResult->fetch_assoc();
            $current_datetime = date('Y-m-d H:i:s');
            
            if(strtotime($current_datetime) >= strtotime($pendingRow['expires_at'])) {
                // Expired - delete old records and allow re-registration
                $checkPending->close();
                
                $deleteVerif = $conn->prepare("DELETE FROM email_verifications WHERE user_id = ?");
                $deleteVerif->bind_param("i", $existing_user_id);
                $deleteVerif->execute();
                $deleteVerif->close();

                $deleteUser = $conn->prepare("DELETE FROM users WHERE Id = ?");
                $deleteUser->bind_param("i", $existing_user_id);
                $deleteUser->execute();
                $deleteUser->close();
            } else {
                $checkPending->close();
                echo json_encode(["status" => "error", "message" => "A verification email has already been sent to this address. Please check your inbox."]);
                exit;
            }
        } else {
            $checkPending->close();
            
            $deleteUser = $conn->prepare("DELETE FROM users WHERE Id = ?");
            $deleteUser->bind_param("i", $existing_user_id);
            $deleteUser->execute();
            $deleteUser->close();
        }
    }
} else {
    $checkMail->close();
};

//check if a company with the same email exists
$checkCompanyMail = $conn->prepare("SELECT company_id FROM company WHERE company_email = ?");
$checkCompanyMail->bind_param("s", $email);
$checkCompanyMail->execute();
$companyResult = $checkCompanyMail->get_result();
if ($companyResult->num_rows > 0) {
    $checkCompanyMail->close();
    echo json_encode(["status" => "error", "message" => "Email already registered! Please login instead."]);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Generate verification token
$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
// Insert new user with email_verified = 0
$query = $conn->prepare("
    INSERT INTO users(First_Name, Last_Name, Email, Password, Gender, email_verified) VALUES (?, ?, ?, ?, ?, 0)
");

$query->bind_param("sssss", $fname, $lname, $email, $hashedPassword, $gender);

if (!$query->execute()) {
    echo json_encode(["status" => "error", "message" => "Error: " . $query->error]);
    exit;
}
$query->close();

$userId = $conn->insert_id;
$verificationQuery = $conn->prepare("INSERT INTO email_verifications (token, user_id, expires_at) VALUES (?, ?, ?)");
$verificationQuery->bind_param("sis", $token, $userId, $expiresAt);
if (!$verificationQuery->execute()) {
    echo json_encode(["status" => "error", "message" => "Error: " . $verificationQuery->error]);
    exit;
}
$verificationQuery->close();
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
            font-family: 'Rubik', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #1f2937;
            background-color: #f9fafb;
            padding: 20px;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }
        .header {
            background-color: #009aab;
            color: white;
            padding: 32px 24px;
            text-align: center;
        }
        .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
        }
        .content {
            padding: 32px 24px;
            background-color: #ffffff;
        }
        .content h2 {
            color: #009aab;
            font-size: 20px;
            margin-bottom: 16px;
        }
        .content p {
            color: #4b5563;
            margin-bottom: 12px;
            font-size: 15px;
        }
        .button-container {
            text-align: center;
            margin: 24px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 32px;
            background-color: #009aab;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 15px;
        }
        .link-box {
            background-color: #f9fafb;
            padding: 12px;
            border-radius: 4px;
            border-left: 3px solid #009aab;
            margin: 16px 0;
            word-break: break-all;
            font-size: 13px;
            color: #4b5563;
        }
        .warning-box {
            background-color: #fef3c7;
            border-left: 3px solid #f59e0b;
            padding: 12px;
            border-radius: 4px;
            margin: 16px 0;
        }
        .warning-box p {
            color: #92400e;
            margin: 0;
            font-size: 13px;
        }
        .footer {
            background-color: #f9fafb;
            text-align: center;
            padding: 24px 16px;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            color: #4b5563;
            font-size: 12px;
            margin: 4px 0;
        }
    </style>
</head>
<body>
    <div class='email-wrapper'>
        <div class='header'>
            <h1>Welcome to JobConnect!</h1>
        </div>
        <div class='content'>
            <h2>Hello $fname $lname, this is Kareem from JobConnect</h2>
            <p>Thank you for joining JobConnect!</p>
            <p>To complete your registration and start exploring job opportunities, please verify your email address by clicking the button below:</p>
            
            <div class='button-container'>
                <a href='$verificationLink' class='button'>Verify Email Address</a>
            </div>
            
            <p style='text-align: center; color: #4b5563; font-size: 13px;'>Or copy and paste this link into your browser:</p>
            <div class='link-box'>$verificationLink</div>
            
            <div class='warning-box'>
                <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
            </div>
            
            <p style='font-size: 13px; color: #4b5563; margin-top: 24px;'>If you did not create an account with JobConnect, please ignore this email.</p>
        </div>
        <div class='footer'>
            <p>&copy; $currentYear JobConnect. All rights reserved.</p>
            <p>Connecting talent with opportunities</p>
        </div>
    </div>
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