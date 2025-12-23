<?php
require 'db_connection.php';
require 'includes/PHPMailer/PHPMailer.php';
require 'includes/PHPMailer/SMTP.php';
require 'includes/PHPMailer/Exception.php';
require 'includes/PHPMailer/mail_config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

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
        
        // Send email using PHPMailer
        $mail = new PHPMailer(true);
        
        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = MAIL_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = MAIL_USER;
            $mail->Password   = MAIL_PASS;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = MAIL_PORT;
            
            $mail->setFrom(MAIL_USER, 'JobConnect');
            $mail->addAddress($email);
            
            $mail->isHTML(true);
            $mail->Subject = 'Password Reset Request';
            
            $reset_link = "http://" . $_SERVER['HTTP_HOST'] . "/pages/reset-password.html?token=" . $token;
            
            $mail->Body = "
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <h2>Password Reset Request</h2>
                    <p>You have requested to reset your password. Click the link below to proceed:</p>
                    <p><a href='$reset_link' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset Password</a></p>
                    <p>Or copy this link: $reset_link</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </body>
                </html>
            ";
            
            $mail->AltBody = "You have requested to reset your password. Click the link to proceed: $reset_link. This link will expire in 1 hour.";
            
            $mail->send();
            echo json_encode(['status' => 'success', 'message' => 'Password reset email sent successfully']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to send email: ' . $mail->ErrorInfo]);
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
        
        $mail = new PHPMailer(true);
        
        try {
            $mail->isSMTP();
            $mail->Host       = MAIL_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = MAIL_USER;
            $mail->Password   = MAIL_PASS;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = MAIL_PORT;
            
            $mail->setFrom(MAIL_USER, 'JobConnect');
            $mail->addAddress($email);
            
            $mail->isHTML(true);
            $mail->Subject = 'Password Reset Request';
            
            $reset_link = "http://" . $_SERVER['HTTP_HOST'] . "/pages/reset-password.html?token=" . $token;
            
            $mail->Body = "
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <h2>Password Reset Request</h2>
                    <p>You have requested to reset your password. Click the link below to proceed:</p>
                    <p><a href='$reset_link' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset Password</a></p>
                    <p>Or copy this link: $reset_link</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </body>
                </html>
            ";
            
            $mail->AltBody = "You have requested to reset your password. Click the link to proceed: $reset_link. This link will expire in 1 hour.";
            
            $mail->send();
            echo json_encode(['status' => 'success', 'message' => 'Password reset email sent successfully']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to send email: ' . $mail->ErrorInfo]);
        }
    }

?>