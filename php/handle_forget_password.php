<?php
require 'db_connection.php';
require 'includes/PHPMailer/sendMail.php';

session_start();
header('Content-Type: application/json');
    $email = $_POST['email'];
    $stmt = $conn->prepare('SELECT Id FROM users WHERE Email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    $type = '';
    $id = $result->fetch_assoc();
    if ($result->num_rows === 0) {
        $stmt = $conn->prepare('SELECT company_id FROM company WHERE company_email = ?');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $id = $result->fetch_assoc();

        if ($result->num_rows === 0) {
            echo json_encode(['status' => 'error', 'message' => 'Email not found']);
            exit();
        }else{
            $type = 'company';
        }
    }
    else{
        $type = 'user';
    }

    if($type === 'user'){
        $user_id = $id['Id'];
        $stmt = $conn->prepare('SELECT * FROM forget_password_requests WHERE user_id = ? AND used = FALSE AND expires_at > NOW()');
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $time_left = '';
            $row = $result->fetch_assoc();
            $expires_at = new DateTime($row['expires_at']);
            $current_time = new DateTime();
            $interval = $current_time->diff($expires_at);
            $seconds = ($interval->h * 3600) + ($interval->i * 60) + $interval->s;

            echo json_encode(['status' => 'error', 'message' => 'A password reset request is already pending', 'time_left' => $seconds]);
            exit();
        }

        // generate random token
        $token = bin2hex(random_bytes(32));
        
        $stmt = $conn->prepare('INSERT INTO forget_password_requests (user_id, token, expires_at, used) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR), FALSE)');
        $stmt->bind_param('is', $user_id, $token);
        
        if (!$stmt->execute()) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to create password reset request']);
            exit();
        }
        
        $reset_link = "http://" . $_SERVER['HTTP_HOST'] . "/pages/reset-password.html?token=" . $token;
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
            <h1>Password Reset Request</h1>
        </div>
        <div class='content'>
            <h2>Hello,</h2>
            <p>We received a request to reset the password for your JobConnect account.</p>
            <p>Click the button below to create a new password:</p>
            
            <div class='button-container'>
                <a href='$reset_link' class='button'>Reset Password</a>
            </div>
            
            <p style='text-align: center; color: #4b5563; font-size: 13px;'>Or copy and paste this link into your browser:</p>
            <div class='link-box'>$reset_link</div>
            
            <div class='warning-box'>
                <p><strong>Important:</strong> This password reset link will expire in 1 hour.</p>
            </div>
            
            <div class='info-box'>
                <p>If you did not request a password reset, please ignore this email.</p>
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
        
        $altBody = "Password Reset Request\n\nWe received a request to reset your JobConnect password.\n\nClick the link to proceed: $reset_link\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\n© $currentYear JobConnect. All rights reserved.";
        
        // Send email
        $result = sendMail($email, 'Password Reset Request', $body, $altBody);
        
        if ($result['success']) {
            echo json_encode(['status' => 'success', 'message' => 'Password reset email sent successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $result['message']]);
        }
    }else{
        $company_id = $id['company_id'];
        $stmt = $conn->prepare('SELECT * FROM forget_password_requests WHERE company_id = ? AND used = FALSE AND expires_at > NOW()');
        $stmt->bind_param('i', $company_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $time_left = '';
            $row = $result->fetch_assoc();
            $expires_at = new DateTime($row['expires_at']);
            $current_time = new DateTime();
            $interval = $current_time->diff($expires_at);
            $seconds = ($interval->h * 3600) + ($interval->i * 60) + $interval->s;
            echo json_encode(['status' => 'error', 'message' => 'A password reset request is already pending for this email.', 'time_left' => $seconds]);
            exit();
        }
        
        $token = bin2hex(random_bytes(32));
        
        $stmt = $conn->prepare('INSERT INTO forget_password_requests (company_id, token, expires_at, used) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR), FALSE)');
        $stmt->bind_param('is', $company_id, $token);
        
        if (!$stmt->execute()) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to create password reset request']);
            exit();
        }
        
        // Prepare email content
        $reset_link = "http://" . $_SERVER['HTTP_HOST'] . "/pages/reset-password.html?token=" . $token;
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
            <h1>Password Reset Request</h1>
        </div>
        <div class='content'>
            <h2>Hello,</h2>
            <p>We received a request to reset the password for your JobConnect company account.</p>
            <p>Click the button below to create a new password:</p>
            
            <div class='button-container'>
                <a href='$reset_link' class='button'>Reset Password</a>
            </div>
            
            <p style='text-align: center; color: #4b5563; font-size: 13px;'>Or copy and paste this link into your browser:</p>
            <div class='link-box'>$reset_link</div>
            
            <div class='warning-box'>
                <p><strong>Important:</strong> This password reset link will expire in 1 hour.</p>
            </div>
            
            <div class='info-box'>
                <p>If you did not request a password reset, please ignore this email.</p>
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
        
        $altBody = "Password Reset Request\n\nWe received a request to reset your JobConnect company password.\n\nClick the link to proceed: $reset_link\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\n© $currentYear JobConnect. All rights reserved.";
        
        // Send email
        $result = sendMail($email, 'Password Reset Request', $body, $altBody);
        
        if ($result['success']) {
            echo json_encode(['status' => 'success', 'message' => 'Password reset email sent successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => $result['message']]);
        }
    }

?>