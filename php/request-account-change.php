<?php
/**
 * Request Account Change (Email or Password)
 * This endpoint initiates the verification process for email/password changes
 * by sending a verification email to the user's current email address.
 */
require 'db_connection.php';
require 'includes/PHPMailer/sendMail.php';

session_start();
header('Content-Type: application/json');

// Check if user is logged in
$user_type = $_SESSION['type'] ?? '';
$user_id = null;
$user_email = '';

if ($user_type === 'user') {
    $user_id = $_SESSION['user_id'] ?? null;
} elseif ($user_type === 'company') {
    $user_id = $_SESSION['company_id'] ?? null;
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
    exit;
}

if (!$user_id) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
    exit;
}

// Get request data
$change_type = $_POST['change_type'] ?? ''; // 'email' or 'password'
$current_password = $_POST['current_password'] ?? '';
$new_email = $_POST['new_email'] ?? '';

// Validate change type
if (!in_array($change_type, ['email', 'password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid change type.']);
    exit;
}

// Current password is required for both operations
if (empty($current_password)) {
    echo json_encode(['status' => 'error', 'message' => 'Current password is required.']);
    exit;
}

// For email change, new email is required
if ($change_type === 'email' && empty($new_email)) {
    echo json_encode(['status' => 'error', 'message' => 'New email is required.']);
    exit;
}

// Validate new email format
if ($change_type === 'email' && !filter_var($new_email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
    exit;
}

// Get user's current email and verify password
if ($user_type === 'user') {
    $stmt = $conn->prepare("SELECT Email, Password FROM users WHERE Id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        exit;
    }
    
    $row = $result->fetch_assoc();
    $user_email = $row['Email'];
    $hashed_password = $row['Password'];
} else {
    $stmt = $conn->prepare("SELECT company_email, password FROM company WHERE company_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Company not found.']);
        exit;
    }
    
    $row = $result->fetch_assoc();
    $user_email = $row['company_email'];
    $hashed_password = $row['password'];
}

// Verify current password
if (!password_verify($current_password, $hashed_password)) {
    echo json_encode(['status' => 'error', 'message' => 'Current password is incorrect.']);
    exit;
}

// Check if new email is already registered (for email change)
if ($change_type === 'email') {
    // Check users table
    $stmt = $conn->prepare("SELECT Id FROM users WHERE Email = ?");
    $stmt->bind_param("s", $new_email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'This email is already registered.']);
        exit;
    }
    
    // Check company table
    $stmt = $conn->prepare("SELECT company_id FROM company WHERE company_email = ?");
    $stmt->bind_param("s", $new_email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'This email is already registered.']);
        exit;
    }
    
    // Check pending requests
    $stmt = $conn->prepare("SELECT id FROM account_change_requests WHERE new_email = ? AND is_used = FALSE AND expires_at > NOW()");
    $stmt->bind_param("s", $new_email);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'This email is pending verification for another account.']);
        exit;
    }
}

// Check for existing pending requests
$id_column = $user_type === 'user' ? 'user_id' : 'company_id';
$stmt = $conn->prepare("SELECT id, expires_at FROM account_change_requests WHERE $id_column = ? AND change_type = ? AND is_used = FALSE AND expires_at > NOW()");
$stmt->bind_param("is", $user_id, $change_type);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $expires_at = new DateTime($row['expires_at']);
    $current_time = new DateTime();
    $interval = $current_time->diff($expires_at);
    $seconds = ($interval->h * 3600) + ($interval->i * 60) + $interval->s;
    
    echo json_encode([
        'status' => 'error', 
        'message' => 'A ' . $change_type . ' change request is already pending. Please check your email.',
        'time_left' => $seconds
    ]);
    exit;
}

// Generate tokens
$token = bin2hex(random_bytes(32));
$new_email_token = $change_type === 'email' ? bin2hex(random_bytes(32)) : null;
$expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

// Insert the change request
if ($user_type === 'user') {
    $stmt = $conn->prepare("INSERT INTO account_change_requests (user_id, change_type, token, new_email, new_email_token, expires_at) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssss", $user_id, $change_type, $token, $new_email, $new_email_token, $expires_at);
} else {
    $stmt = $conn->prepare("INSERT INTO account_change_requests (company_id, change_type, token, new_email, new_email_token, expires_at) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssss", $user_id, $change_type, $token, $new_email, $new_email_token, $expires_at);
}

if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to create change request.']);
    exit;
}

// Send verification email to current email address
$verification_link = "http://" . $_SERVER['HTTP_HOST'] . "/pages/account-change-verify.html?token=" . $token . "&type=" . $change_type;
$currentYear = date('Y');

if ($change_type === 'email') {
    $subject = 'Confirm Email Change Request';
    $change_description = "change your email address to <strong>$new_email</strong>";
    $header_title = "Email Change Request";
} else {
    $subject = 'Confirm Password Change Request';
    $change_description = "change your password";
    $header_title = "Password Change Request";
}

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
            <h1>$header_title</h1>
        </div>
        <div class='content'>
            <h2>Hello,</h2>
            <p>We received a request to $change_description on your JobConnect account.</p>
            <p>Click the button below to confirm this change:</p>
            
            <div class='button-container'>
                <a href='$verification_link' class='button'>Confirm Change</a>
            </div>
            
            <p style='text-align: center; color: #4b5563; font-size: 13px;'>Or copy and paste this link into your browser:</p>
            <div class='link-box'>$verification_link</div>
            
            <div class='warning-box'>
                <p><strong>Important:</strong> This verification link will expire in 1 hour.</p>
            </div>
            
            <div class='info-box'>
                <p>If you did not request this change, please ignore this email.</p>
            </div>
        </div>
        <div class='footer'>
            <p>&copy; $currentYear JobConnect. All rights reserved.</p>
            <p>Connecting talent with opportunities</p>
        </div>
    </div>
</body>
</html>
";

$altBody = "$header_title\n\nWe received a request to $change_description on your JobConnect account.\n\nClick the link to confirm: $verification_link\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\n© $currentYear JobConnect. All rights reserved.";

// Send email
$result = sendMail($user_email, $subject, $body, $altBody);

if ($result['success']) {
    $response_message = $change_type === 'email' 
        ? 'Verification email sent to your current email address. After confirming, a verification email will also be sent to your new email address.'
        : 'Verification email sent. Please check your inbox to confirm the password change.';
    
    echo json_encode(['status' => 'success', 'message' => $response_message]);
} else {
    // Delete the request if email failed
    $stmt = $conn->prepare("DELETE FROM account_change_requests WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    
    echo json_encode(['status' => 'error', 'message' => 'Failed to send verification email. Please try again.']);
}
?>
