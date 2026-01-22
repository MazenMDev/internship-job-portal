<?php
/**
 * Verify Account Change
 * This endpoint handles the verification of email/password change requests
 * When user clicks the link in their current email.
 */
require 'db_connection.php';
require 'includes/PHPMailer/sendMail.php';

header('Content-Type: application/json');

$token = $_GET['token'] ?? '';
$change_type = $_GET['type'] ?? '';
$action = $_GET['action'] ?? 'verify'; // 'verify' or 'check'

if (empty($token)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid verification link.']);
    exit;
}

// Get the change request
$stmt = $conn->prepare("
    SELECT account_change_requests.id, account_change_requests.user_id, account_change_requests.company_id, 
           account_change_requests.change_type, account_change_requests.token,
           account_change_requests.new_email, account_change_requests.new_email_token, account_change_requests.new_email_verified,
           account_change_requests.old_email_verified, account_change_requests.created_at, account_change_requests.expires_at, account_change_requests.is_used,
           users.Email as user_email, 
           company.company_email,
           CASE WHEN account_change_requests.user_id IS NOT NULL THEN 'user' ELSE 'company' END as account_type
    FROM account_change_requests
    LEFT JOIN users ON account_change_requests.user_id = users.Id
    LEFT JOIN company ON account_change_requests.company_id = company.company_id
    WHERE account_change_requests.token = ?
");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid or expired verification link.']);
    exit;
}

$request = $result->fetch_assoc();

// Check if already used
if ($request['is_used']) {
    echo json_encode(['status' => 'error', 'message' => 'This verification link has already been used.']);
    exit;
}

// Check if expired
if (strtotime($request['expires_at']) < time()) {
    echo json_encode(['status' => 'error', 'message' => 'This verification link has expired.']);
    exit;
}

$current_email = $request['user_email'] ?? $request['company_email'];

// If just checking status
if ($action === 'check') {
    $response = [
        'status' => 'success',
        'change_type' => $request['change_type'],
        'new_email' => $request['new_email'],
        'old_email_verified' => (bool)$request['old_email_verified'],
        'new_email_verified' => (bool)$request['new_email_verified'],
        'current_email' => $current_email
    ];
    echo json_encode($response);
    exit;
}

// Process the verification
if ($request['change_type'] === 'password') {
    // For password change, mark as verified and redirect to password reset page
    $stmt = $conn->prepare("UPDATE account_change_requests SET old_email_verified = TRUE WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Email verified. You can now set your new password.',
        'change_type' => 'password',
        'redirect' => 'set_password',
        'token' => $token
    ]);
    exit;
    
} else if ($request['change_type'] === 'email') {
    // For email change, first verify old email then send verification to new email
    
    if (!$request['old_email_verified']) {
        // Mark old email as verified
        $stmt = $conn->prepare("UPDATE account_change_requests SET old_email_verified = TRUE WHERE token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        
        // Send verification email to the new email address
        $new_email = $request['new_email'];
        $new_email_token = $request['new_email_token'];
        $verification_link = "http://" . $_SERVER['HTTP_HOST'] . "/php/verify-new-email.php?token=" . $new_email_token;
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
            background-color: #d1ecf1;
            border-left: 4px solid #0c5460;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .info-box p {
            color: #0c5460;
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
            <h1>Verify Your New Email</h1>
        </div>
        <div class='content'>
            <h2>Hello,</h2>
            <p>Someone requested to use this email address for their JobConnect account.</p>
            <p>If this was you, click the button below to verify this email address:</p>
            
            <div class='button-container'>
                <a href='$verification_link' class='button'>Verify New Email</a>
            </div>
            
            <p style='text-align: center; color: #888; font-size: 14px;'>Or copy and paste this link into your browser:</p>
            <div class='link-box'>$verification_link</div>
            
            <div class='warning-box'>
                <p><strong>Important:</strong> This verification link will expire soon. Please complete verification promptly.</p>
            </div>
            
            <div class='info-box'>
                <p><strong>Security Notice:</strong> If you did not request this, please ignore this email. No changes will be made to any account.</p>
            </div>
        </div>
        <div class='footer'>
            <p>&copy; <span class='year'>$currentYear</span> JobConnect. All rights reserved.</p>
            <p>Connecting talent with opportunities</p>
        </div>
    </div>
</body>
</html>
";
        
        $altBody = "Verify Your New Email\n\nSomeone requested to use this email address for their JobConnect account.\n\nClick the link to verify: $verification_link\n\nIf you didn't request this, please ignore this email.\n\n© $currentYear JobConnect. All rights reserved.";
        
        $result = sendMail($new_email, 'Verify Your New Email Address', $body, $altBody);
        
        if ($result['success']) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Current email verified! A verification email has been sent to your new email address: ' . $new_email,
                'change_type' => 'email',
                'step' => 'old_verified',
                'new_email' => $new_email
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to send verification email to new address. Please try again later.'
            ]);
        }
        exit;
    } else {
        echo json_encode([
            'status' => 'info',
            'message' => 'Your current email has already been verified. Please check your new email address for the verification link.',
            'new_email' => $request['new_email']
        ]);
        exit;
    }
}
?>
