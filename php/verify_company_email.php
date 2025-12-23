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
    SELECT id, company_name, company_email, password, company_phone, company_address, 
           company_city, company_state, company_zip, company_country, company_website,
           expires_at, is_used 
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

// Check if email already exists in company or verify_company tables
$checkEmail = $conn->prepare("SELECT 1 FROM company WHERE company_email = ? UNION SELECT 1 FROM verify_company WHERE company_email = ?");
$checkEmail->bind_param("ss", $verification['company_email'], $verification['company_email']);
$checkEmail->execute();
$checkEmail->store_result();

if ($checkEmail->num_rows > 0) {
    $checkEmail->close();
    
    // Mark as used
    $markUsed = $conn->prepare("UPDATE company_email_verifications SET is_used = TRUE WHERE id = ?");
    $markUsed->bind_param("i", $verification['id']);
    $markUsed->execute();
    $markUsed->close();
    
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("This email is already registered."));
    exit;
}
$checkEmail->close();

// Begin transaction
$conn->begin_transaction();

try {
    // Insert into verify_company table for admin verification
    $insertCompany = $conn->prepare("
        INSERT INTO verify_company (company_name, company_email, password, company_phone, 
                                   company_address, company_city, company_state, company_zip, 
                                   company_country, company_website)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $insertCompany->bind_param(
        "ssssssssss",
        $verification['company_name'],
        $verification['company_email'],
        $verification['password'],
        $verification['company_phone'],
        $verification['company_address'],
        $verification['company_city'],
        $verification['company_state'],
        $verification['company_zip'],
        $verification['company_country'],
        $verification['company_website']
    );
    
    if (!$insertCompany->execute()) {
        throw new Exception("Failed to submit company for verification.");
    }
    $insertCompany->close();
    
    $markUsed = $conn->prepare("UPDATE company_email_verifications SET is_used = TRUE WHERE id = ?");
    $markUsed->bind_param("i", $verification['id']);
    
    if (!$markUsed->execute()) {
        throw new Exception("Failed to update verification status.");
    }
    $markUsed->close();
    
    $conn->commit();
    $conn->close();
    
    header("Location: ../pages/verification-result.html?status=success&message=" . urlencode("Email verified successfully! Your company registration is now pending admin approval. Please allow up to 3 working days for verification."));
    exit;
    
} catch (Exception $e) {
    $conn->rollback();
    $conn->close();
    header("Location: ../pages/verification-result.html?status=error&message=" . urlencode("Verification failed. Please try again."));
    exit;
}
?>
