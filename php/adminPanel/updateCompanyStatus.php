<?php
    include '../db_connection.php';
    include '../includes/PHPMailer/sendMail.php';
    session_start();
    header('Content-Type: application/json');

    if(!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $verif_id = $_POST['company_id'];
    $status = $_POST['status'];

    if($status == 1){
        // Get the verification record to get company_id
        $stmt = $conn->prepare("SELECT company_id FROM verify_company WHERE verification_id = ?");
        $stmt->bind_param("i", $verif_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $verification = $result->fetch_assoc();
        $stmt->close();

        if (!$verification) {
            echo json_encode(['error' => 'Company verification record not found']);
            exit;
        }

        // Get company details from company table
        $stmt = $conn->prepare("SELECT company_id, company_name, company_email FROM company WHERE company_id = ?");
        $stmt->bind_param("i", $verification['company_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $company = $result->fetch_assoc();
        $stmt->close();

        if (!$company) {
            echo json_encode(['error' => 'Company not found']);
            exit;
        }

        // Set company_verified = 2 (fully verified)
        $stmt = $conn->prepare("UPDATE company SET company_verified = 2 WHERE company_id = ?");
        $stmt->bind_param("i", $company['company_id']);


        if ($stmt->execute()) {
            $stmt->close();
            $stmt = $conn->prepare("DELETE FROM verify_company WHERE verification_id = ?");
            $stmt->bind_param("i", $verif_id);
            $stmt->execute();
            $stmt->close();
            $to = $company['company_email'];
            $subject = "Company Verification Successful";
            $adminName = $_SESSION['first_name'];
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
                            background-color: #10b981;
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
                        .success-box {
                            background-color: #f0fdf4;
                            border-left: 3px solid #10b981;
                            padding: 12px;
                            border-radius: 4px;
                            margin: 16px 0;
                        }
                        .success-box p {
                            color: #166534;
                            margin: 0;
                            font-size: 13px;
                        }
                        .info-box {
                            background-color: #f9fafb;
                            border-left: 3px solid #009aab;
                            padding: 12px;
                            border-radius: 4px;
                            margin: 16px 0;
                        }
                        .info-box p {
                            color: #4b5563;
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
                            <h1>Verification Successful!</h1>
                        </div>
                        <div class='content'>
                            <h2>Welcome, " . htmlspecialchars($company['company_name']) . "! This is " . htmlspecialchars($adminName) . " from JobConnect</h2>
                            <p>Your company has been successfully verified and registered on JobConnect.</p>
                            
                            <div class='success-box'>
                                <p><strong>Verification Complete:</strong> Your company account is now active.</p>
                            </div>
                            
                            <p>You can now access all features including:</p>
                            <ul style='color: #4b5563; margin-left: 20px; margin-bottom: 16px;'>
                                <li>Post job opportunities</li>
                                <li>Review applicant profiles</li>
                                <li>Manage your company profile</li>
                            </ul>
                            
                            <div class='button-container'>
                                <a href='" . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . "/pages/login-register.html' class='button'>Login Now</a>
                            </div>
                            
                            <div class='info-box'>
                                <p>Use your registered email (" . htmlspecialchars($company['company_email']) . ") and password to log in.</p>
                            </div>
                        </div>
                        <div class='footer'>
                            <p>&copy; " . date('Y') . " JobConnect. All rights reserved.</p>
                            <p>Connecting talent with opportunities</p>
                        </div>
                    </div>
                </body>
                </html>";
            $altBody = "Dear " . $company['company_name'] . ",\n\nYour company has been successfully verified and registered on our platform.\n\nYou can now log in using your email and password.\n\nBest regards,\nJobConnect Team";
            sendMail($to, $subject, $body, $altBody);
            echo json_encode(['success' => true, 'message' => 'Company verified and registered successfully']);
        } else {
            echo json_encode(['error' => 'Failed to register company']);
        }

    } elseif ($status == 2) {
        // Get the verification record to get company_id
        $stmt = $conn->prepare("SELECT company_id FROM verify_company WHERE verification_id = ?");
        $stmt->bind_param("i", $verif_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $verification = $result->fetch_assoc();
        $stmt->close();

        if (!$verification) {
            echo json_encode(['error' => 'Company verification record not found']);
            exit;
        }

        // Get company details from company table
        $stmt = $conn->prepare("SELECT company_id, company_name, company_email FROM company WHERE company_id = ?");
        $stmt->bind_param("i", $verification['company_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $company = $result->fetch_assoc();
        $stmt->close();

        if (!$company) {
            echo json_encode(['error' => 'Company not found']);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM verify_company WHERE verification_id = ?");
        $stmt->bind_param("i", $verif_id);
        if ($stmt->execute()) {
            $stmt->close();

            $stmt = $conn->prepare("UPDATE company SET company_verified = -1 WHERE company_id = ?");
            $stmt->bind_param("i", $company['company_id']);
            $stmt->execute();
            $stmt->close();


            
            $to = $company['company_email'];
            $subject = "Company Verification Status";
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
                            background-color: var(--error);
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
                            color: #1f2937;
                            font-size: 20px;
                            margin-bottom: 16px;
                        }
                        .content p {
                            color: #4b5563;
                            margin-bottom: 12px;
                            font-size: 15px;
                        }
                        .warning-box {
                            background-color: #fef2f2;
                            border-left: 3px solid var(--error);
                            padding: 12px;
                            border-radius: 4px;
                            margin: 16px 0;
                        }
                        .warning-box p {
                            color: #991b1b;
                            margin: 0;
                            font-size: 13px;
                        }
                        .info-box {
                            background-color: #f9fafb;
                            border-left: 3px solid #009aab;
                            padding: 12px;
                            border-radius: 4px;
                            margin: 16px 0;
                        }
                        .info-box p {
                            color: #4b5563;
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
                            <h1>Verification Update</h1>
                        </div>
                        <div class='content'>
                            <h2>Dear " . htmlspecialchars($company['company_name']) . ",</h2>
                            <p>Thank you for your interest in joining JobConnect.</p>
                            
                            <div class='warning-box'>
                                <p><strong>Status:</strong> We were unable to verify your company registration at this time.</p>
                            </div>
                            
                            <p>This could be due to:</p>
                            <ul style='color: #4b5563; margin-left: 20px; margin-bottom: 16px;'>
                                <li>Incomplete or inaccurate company information</li>
                                <li>Unable to verify company credentials</li>
                                <li>Documentation requirements not met</li>
                            </ul>
                            
                            <div class='info-box'>
                                <p>You are welcome to submit a new registration with updated information.</p>
                            </div>
                        </div>
                        <div class='footer'>
                            <p>&copy; " . date('Y') . " JobConnect. All rights reserved.</p>
                            <p>Connecting talent with opportunities</p>
                        </div>
                    </div>
                </body>
                </html>";
            $altBody = "Dear " . $company['company_name'] . ",\n\nThank you for your interest in joining the JobConnect platform.\n\nUnfortunately, we were unable to verify your company registration at this time.\n\nYou are welcome to submit a new registration with updated information.\n\nBest regards,\nJobConnect Team";
            sendMail($to, $subject, $body, $altBody);
            
            echo json_encode(['success' => true, 'message' => 'Company rejected successfully']);
        } else {
            echo json_encode(['error' => 'Failed to reject company']);
            $stmt->close();
        }
    } else {
        echo json_encode(['error' => 'Invalid status']);
    }
?>