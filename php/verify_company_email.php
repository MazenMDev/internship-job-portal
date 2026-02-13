<?php
include 'db_connection.php';

// Get token from URL
$token = $_GET['token'] ?? '';

if (empty($token)) {
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("Invalid verification link."));
    exit;
}

// Check if token exists and is valid
$stmt = $conn->prepare("
    SELECT *
    FROM company_email_verifications 
    WHERE token = ?
");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("Invalid or expired verification link."));
    exit;
}

$verification = $result->fetch_assoc();
$stmt->close();

// Check if already used
if ($verification['is_used']) {
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("This verification link has already been used."));
    exit;
}

// Check if expired
$currentTime = date('Y-m-d H:i:s');
if ($currentTime > $verification['expires_at']) {
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("This verification link has expired. Please register again."));
    exit;
}

// Check if company exists
$checkCompany = $conn->prepare("SELECT company_id, company_name, company_email FROM company WHERE company_id = ?");
$checkCompany->bind_param("i", $verification['company_id']);
$checkCompany->execute();
$companyResult = $checkCompany->get_result();

if ($companyResult->num_rows === 0) {
    $checkCompany->close();
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("Company not found."));
    exit;
}

$company = $companyResult->fetch_assoc();
$checkCompany->close();

// Mark verification token as used
$markUsed = $conn->prepare("UPDATE company_email_verifications SET is_used = TRUE WHERE id = ?");
$markUsed->bind_param("i", $verification['id']);
$markUsed->execute();
$markUsed->close();

// Update company_verified to 1 (under admin verification)
$stmt = $conn->prepare("UPDATE company SET company_verified = 1 WHERE company_id = ?");
$stmt->bind_param("i", $verification['company_id']);
$stmt->execute();
$stmt->close();

// Insert into verify_company table for admin review
$stmt = $conn->prepare("INSERT INTO verify_company (company_id) VALUES (?)");
$stmt->bind_param("i", $verification['company_id']);
$stmt->execute();
$stmt->close();

include 'includes/PHPMailer/sendMail.php';

// Send verification email to current email address
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

<body>
    <div class='email-wrapper'>
        <div class='header'>
            <h1>Account Under Review</h1>
        </div>
        <div class='content'>
            <h2>Hello,</h2>
            <p>Thank you for registering with JobConnect!</p>
            <p>Your company account is currently being reviewed by our team to ensure compliance with our policies and standards.</p>
            
            <div class='info-box'>
                <p><strong>Review Status:</strong> In Progress</p>
            </div>
            
            <p>We typically complete our review within 2-3 business days. Once approved, you'll receive a confirmation email and can start posting job opportunities.</p>
            
            <div class='warning-box'>
                <p><strong>Note:</strong> Please ensure all company information is accurate and up-to-date for a smooth review process.</p>
            </div>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
        </div>
        <div class='footer'>
            <p>&copy; $currentYear JobConnect. All rights reserved.</p>
            <p>Connecting talent with opportunities</p>
        </div>
    </div>
</body>
</html>
";

$subject = "Company Account Under Review";
$user_email = $company['company_email'];
$altBody = "Account Under Review\n\nThank you for registering with JobConnect!\n\nYour company account is currently being reviewed by our team to ensure compliance with our policies and standards.\n\nReview Status: In Progress\n\nWe typically complete our review within 2-3 business days. Once approved, you'll receive a confirmation email and can start posting job opportunities.\n\nIf you have any questions, please don't hesitate to contact our support team.\n\n© $currentYear JobConnect. All rights reserved.";

// Send email
$result = sendMail($user_email, $subject, $body, $altBody);

$conn->close();

if ($result['success']) {
    header("Location: ../pages/verification-result.html?status=success&message=" . urlencode("Email verified successfully! Your company is now under admin review."));
    exit;
} else {
    header("Location: ../pages/verification-result.html?status=success&message=" . urlencode("Email verified successfully! Your company is now under admin review."));
    exit;
}

?>
