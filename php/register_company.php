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

// Check if company with this email already exists
$stmt = $conn->prepare("SELECT company_id, company_verified FROM company WHERE company_email = ?");
$stmt->bind_param("s", $company_email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $existing_company_id = $row['company_id'];

    // 2 =  verified and registered
    if($row['company_verified'] == 2){
        echo json_encode(["status" => "error", "message" => "This email is already registered. Please login instead."]);
        $stmt->close();
        exit;
    }
    // 1 = under admin verification
    else if($row['company_verified'] == 1){
        echo json_encode(["status" => "error", "message" => "Your company registration is still under admin verification. Please wait for approval."]);
        $stmt->close();
        exit;
    }
    // -1 = rejected
    else if($row['company_verified'] == -1){
        echo json_encode(["status" => "error", "message" => "Your company registration has been rejected. Please contact support for more information."]);
        $stmt->close();
        exit;
    }
    // 0 = hasn't verified email yet - check if verification expired
    else if($row['company_verified'] == 0){
        $stmt->close();
        
        // Check if there's a pending verification
        $checkPending = $conn->prepare("SELECT id, expires_at FROM company_email_verifications WHERE company_id = ? AND is_used = FALSE ORDER BY created_at DESC LIMIT 1");
        $checkPending->bind_param("i", $existing_company_id);
        $checkPending->execute();
        $pendingResult = $checkPending->get_result();
        
        if ($pendingResult->num_rows > 0) {
            $pendingRow = $pendingResult->fetch_assoc();
            $current_datetime = date('Y-m-d H:i:s');
            
            // Check if verification has expired
            if(strtotime($current_datetime) >= strtotime($pendingRow['expires_at'])) {
                // Expired
                $checkPending->close();
                
                $deleteVerif = $conn->prepare("DELETE FROM company_email_verifications WHERE company_id = ?");
                $deleteVerif->bind_param("i", $existing_company_id);
                $deleteVerif->execute();
                $deleteVerif->close();

                $deleteCompany = $conn->prepare("DELETE FROM company WHERE company_id = ?");
                $deleteCompany->bind_param("i", $existing_company_id);
                $deleteCompany->execute();
                $deleteCompany->close();
            } else {
                // Not expired
                $checkPending->close();
                echo json_encode(["status" => "error", "message" => "A verification email has already been sent to this address. Please check your inbox."]);
                exit;
            }
        } else {
            // No pending verification but company_verified = 0, delete and allow re-registration
            $checkPending->close();
            
            $deleteCompany = $conn->prepare("DELETE FROM company WHERE company_id = ?");
            $deleteCompany->bind_param("i", $existing_company_id);
            $deleteCompany->execute();
            $deleteCompany->close();
        }
    }
} else {
    $stmt->close();
}

//check if a user with the same email exists
$checkUserMail = $conn->prepare("SELECT Id FROM users WHERE Email = ?");
$checkUserMail->bind_param("s", $company_email);
$checkUserMail->execute();
$userResult = $checkUserMail->get_result();
if ($userResult->num_rows > 0) {
    $checkUserMail->close();
    echo json_encode(["status" => "error", "message" => "Email already registered! Please login instead."]);
    exit;
}

$checkUserMail->close();

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("
    INSERT INTO company (company_name, company_email, password, phone_number, street_address, city, state, zip_code, country, company_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->bind_param(
    "ssssssssss", 
    $company_name, $company_email, $hashed_password, $company_phone, $company_address, 
    $company_city, $company_state, $company_zip, $company_country, $company_link
);
if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Error creating company: " . $stmt->error]);
    exit;
}
$company_id = $conn->insert_id;
$stmt->close();

// Generate verification token
$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

$stmt = $conn->prepare("
    INSERT INTO company_email_verifications (token, company_id, expires_at)
    VALUES (?, ?, ?)
");
$stmt->bind_param(
    "sis", 
    $token, $company_id, $expiresAt
);

if (!$stmt->execute()) {
    // Rollback company creation if verification insert fails
    $deleteCompany = $conn->prepare("DELETE FROM company WHERE company_id = ?");
    $deleteCompany->bind_param("i", $company_id);
    $deleteCompany->execute();
    $deleteCompany->close();
    
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
        .info-box {
            background-color: #f0fdf4;
            border-left: 3px solid #10b981;
            padding: 12px;
            border-radius: 4px;
            margin: 16px 0;
        }
        .info-box p {
            color: #166534;
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
            <h2>Hello $company_name, this is Mazen from JobConnect</h2>
            <p>Thank you for registering your company with JobConnect!</p>
            <p>To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div class='button-container'>
                <a href='$verificationLink' class='button'>Verify Email Address</a>
            </div>
            
            <p style='text-align: center; color: #4b5563; font-size: 13px;'>Or copy and paste this link into your browser:</p>
            <div class='link-box'>$verificationLink</div>
            
            <div class='warning-box'>
                <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
            </div>
            
            <div class='info-box'>
                <p><strong>Next Steps:</strong> After email verification, your company registration will be reviewed by our admin team. Please allow up to 3 working days.</p>
            </div>
            
            <p style='font-size: 13px; color: #4b5563; margin-top: 24px;'>If you did not register this company, please ignore this email.</p>
        </div>
        <div class='footer'>
            <p>&copy; $currentYear JobConnect. All rights reserved.</p>
            <p>Connecting talent with opportunities</p>
        </div>
    </div>
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