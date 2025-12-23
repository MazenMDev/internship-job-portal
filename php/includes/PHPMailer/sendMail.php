<?php
    require_once 'mail_config.php';
    require_once 'SMTP.php';
    require_once 'PHPMailer.php';
    require_once 'Exception.php';


    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    function sendMail($to, $subject, $body, $altBody = '', $fromName = 'JobConnect') {
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
            
            // Recipients
            $mail->setFrom(MAIL_USER, $fromName);
            $mail->addAddress($to);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;
            
            if (!empty($altBody)) {
                $mail->AltBody = $altBody;
            }
            
            $mail->send();
            return ['success' => true, 'message' => 'Email sent successfully'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Failed to send email: ' . $mail->ErrorInfo];
        }
    }
?>