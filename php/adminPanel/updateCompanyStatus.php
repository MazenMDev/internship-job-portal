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
        $stmt = $conn->prepare("SELECT * FROM verify_company WHERE verification_id = ?");
        $stmt->bind_param("i", $verif_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $company = $result->fetch_assoc();
        $stmt->close();

        if (!$company) {
            echo json_encode(['error' => 'Company not found']);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO company (company_name, company_email, password, phone_number, street_address, city, state, zip_code, country, company_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssssss", $company['company_name'], $company['company_email'], $company['password'], $company['company_phone'], $company['company_address'], $company['company_city'], $company['company_state'], $company['company_zip'], $company['company_country'], $company['company_website']);

        if ($stmt->execute()) {
            $stmt->close();
            $stmt = $conn->prepare("DELETE FROM verify_company WHERE verification_id = ?");
            $stmt->bind_param("i", $verif_id);
            $stmt->execute();
            $stmt->close();
            $to = $company['company_email'];
            $subject = "Company Verification Successful";
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
                        .success-box {
                            background-color: #d4edda;
                            border-left: 4px solid #28a745;
                            padding: 15px;
                            border-radius: 6px;
                            margin: 20px 0;
                        }
                        .success-box p {
                            color: #155724;
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
                            <h1>Verification Successful!</h1>
                        </div>
                        <div class='content'>
                            <h2>Welcome, " . htmlspecialchars($company['company_name']) . "!</h2>
                            <p>Congratulations! Your company has been successfully verified and registered on the JobConnect platform.</p>
                            
                            <div class='success-box'>
                                <p><strong>✓ Verification Complete:</strong> Your company account is now active and ready to use.</p>
                            </div>
                            
                            <p>You can now access all features of our platform including:</p>
                            <ul style='color: #555; margin-left: 20px; margin-bottom: 20px;'>
                                <li>Post job opportunities</li>
                                <li>Review applicant profiles</li>
                                <li>Manage your company profile</li>
                                <li>Connect with talented professionals</li>
                            </ul>
                            
                            <div class='button-container'>
                                <a href='" . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . "/pages/login-register.html' class='button'>Login Now</a>
                            </div>
                            
                            <div class='info-box'>
                                <p><strong>Getting Started:</strong> Use your registered email (" . htmlspecialchars($company['company_email']) . ") and password to log in to your account.</p>
                            </div>
                        </div>
                        <div class='footer'>
                            <p>&copy; <span class='year'>" . date('Y') . "</span> JobConnect. All rights reserved.</p>
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
        $stmt = $conn->prepare("SELECT company_name, company_email FROM verify_company WHERE verification_id = ?");
        $stmt->bind_param("i", $verif_id);
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
                            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
                            color: #dc3545;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .content p {
                            color: #555;
                            margin-bottom: 15px;
                            font-size: 16px;
                        }
                        .warning-box {
                            background-color: #f8d7da;
                            border-left: 4px solid #dc3545;
                            padding: 15px;
                            border-radius: 6px;
                            margin: 20px 0;
                        }
                        .warning-box p {
                            color: #721c24;
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
                            <h1>Verification Update</h1>
                        </div>
                        <div class='content'>
                            <h2>Dear " . htmlspecialchars($company['company_name']) . ",</h2>
                            <p>Thank you for your interest in joining the JobConnect platform.</p>
                            
                            <div class='warning-box'>
                                <p><strong>Application Status:</strong> Unfortunately, we were unable to verify your company registration at this time.</p>
                            </div>
                            
                            <p>This could be due to one of the following reasons:</p>
                            <ul style='color: #555; margin-left: 20px; margin-bottom: 20px;'>
                                <li>Incomplete or inaccurate company information</li>
                                <li>Unable to verify company credentials</li>
                                <li>Documentation requirements not met</li>
                            </ul>
                            
                            <div class='info-box'>
                                <p><strong>Next Steps:</strong> You are welcome to submit a new registration with updated and accurate information. If you believe this decision was made in error, please contact our support team.</p>
                            </div>
                        </div>
                        <div class='footer'>
                            <p>&copy; <span class='year'>" . date('Y') . "</span> JobConnect. All rights reserved.</p>
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