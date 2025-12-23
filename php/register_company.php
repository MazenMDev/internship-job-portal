<?php
include 'db_connection.php';
include 'includes/PHPMailer/sendMail.php';
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

if (
    empty($company_name) || empty($company_email) || empty($password) || empty($company_phone) ||
    empty($company_address) || empty($company_city) || empty($company_state) ||
    empty($company_zip) || empty($company_country) || empty($company_link)
) {
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
$stmt->close();

// Check if email already in verify_company table
$stmt = $conn->prepare("SELECT verification_id FROM verify_company WHERE company_email = ?");
$stmt->bind_param("s", $company_email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Your company registration is already pending admin verification."]);
    exit;
}
$stmt->close();

// Check if email already has a pending email verification
$checkPending = $conn->prepare("SELECT * FROM company_email_verifications WHERE company_email = ? AND is_used = FALSE");
$checkPending->bind_param("s", $company_email);
$checkPending->execute();
$checkPending->store_result();

if ($checkPending->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "A verification email has already been sent to this address. Please check your inbox."]);
    exit;
}
$checkPending->close();

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Generate verification token
$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

// Insert into company_email_verifications table
$stmt = $conn->prepare("
    INSERT INTO company_email_verifications 
    (token, expires_at, company_name, company_email, password, company_phone, 
     company_address, company_city, company_state, company_zip, company_country, company_website)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param(
    "ssssssssssss", 
    $token, $expiresAt, $company_name, $company_email, $hashed_password, $company_phone,
    $company_address, $company_city, $company_state, $company_zip, $company_country, $company_link
);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
    exit;
}
$stmt->close();

// Send verification email
$verificationLink = "http://" . $_SERVER['HTTP_HOST'] . "/php/verify_company_email.php?token=" . urlencode($token);
$subject = 'Verify Your Company Email Address';
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
        .info-box {
            background-color: #e7f3ff;
            border-left: 4px solid #0066cc;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .info-box p {
            color: #004080;
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
            <h1>Welcome to JobConnect! </h1>
        </div>
        <div class='content'>
            <h2>Hello $company_name,</h2>
            <p>Thank you for registering your company with JobConnect! We're excited to have you join our platform.</p>
            <p>To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div class='button-container'>
                <a href='$verificationLink' class='button'>Verify Email Address</a>
            </div>
            
            <p style='text-align: center; color: #888; font-size: 14px;'>Or copy and paste this link into your browser:</p>
            <div class='link-box'>$verificationLink</div>
            
            <div class='warning-box'>
                <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
            </div>
            
            <div class='info-box'>
                <p><strong>Next Steps:</strong> After email verification, your company registration will be reviewed by our admin team. Please allow up to 3 working days for verification.</p>
            </div>
            
            <p style='font-size: 14px; color: #888; margin-top: 30px;'>If you did not register this company, please ignore this email or contact our support team.</p>
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

$altBody = "Hello $company_name,\n\nThank you for registering with JobConnect!\n\nTo complete your registration, please verify your email by visiting:\n$verificationLink\n\nThis link will expire in 24 hours.\n\nAfter email verification, your company registration will be reviewed by our admin team. Please allow up to 3 working days for verification.\n\nIf you did not register this company, please ignore this email.\n\n© $currentYear JobConnect. All rights reserved.";

$result = sendMail($company_email, $subject, $body, $altBody);

if ($result['success']) {
    echo json_encode(["status" => "success", "message" => "Registration successful! Please check your email to verify your account."]);
} else {
    echo json_encode(["status" => "error", "message" => "Email address is not found : " . $result['message']]);
    $deleteStmt = $conn->prepare("DELETE FROM company_email_verifications WHERE company_email = ?");
    $deleteStmt->bind_param("s", $company_email);
    $deleteStmt->execute();
    $deleteStmt->close();
}

$conn->close();
?>