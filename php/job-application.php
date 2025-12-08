<?php

include './db_connection.php';

session_start();
header('Content-Type: application/json');

// IF REQUEST IS POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed.']);
    exit;
}


$errors = [];
$success = false;

// FULL NAME VALIDATION
if(empty(trim($_POST['full_name']?? '')))
{
    $errors['full_name']= "Full Name is required.";
}else{
    $full_name= filter_var(trim($_POST['full name']), FILTER_SANITIZE_STRING);
}


// EMAIL VALIDATION

if(empty(trim($_POST['email']?? '')))
{
    $errors['email']= "Email address is required.";
}else if(!filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL)){

    $errors['email']="Invalid email format";
}else{
    $email= filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
}

// COVER LETTER VALIDATION

if(empty(trim($_POST['cover_letter']?? ''))){
    $errors['cover_letter']="Cover letter is required";
}else{
    $cover_letter= filter_var(trim($_POST['cover_letter']), FILTER_SANITIZE_STRING);
}

// additional note
$note = filter_var($_POST['note'] ?? '', FILTER_SANITIZE_STRING);


// ex level validation
$valid_levels = ['entry-level', 'mid-level', 'senior-level'];
if (empty($_POST['experience_level'] ?? '') || !in_array($_POST['experience_level'], $valid_levels)) {
    $errors['experience_level'] = "Experience Level selection is invalid or missing.";
} else {
    $experience_level = filter_var($_POST['experience_level'], FILTER_SANITIZE_STRING);
}


$resume = null;
if(empty($_FILES['resume'] ?? '')){
    $errors['resume']="Resume upload is required.";
}else{
    $resume = $_FILES['resume'];
}

if (empty($errors)) {
    $application_data = [
        'user_id' => $_SESSION['user_id'] ?? null,
        'job_id' => $_POST['job_id'] ?? null,
        'full_name' => $full_name,
        'email' => $email,
        'experience_level' => $experience_level,
        'cover_letter' => $cover_letter,
        'additional_note' => $note,
        'resume' => $resume
    ];
    
    $stmt = $conn->prepare("INSERT INTO job_applications (user_id, job_id, full_name, email, experience_level, cover_letter, additional_note, resume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param(
        "iissssss",
        $application_data['user_id'],
        $application_data['job_id'],
        $application_data['full_name'],
        $application_data['email'],
        $application_data['experience_level'],
        $application_data['cover_letter'],
        $application_data['additional_note'],
        $application_data['resume']
    );
    if ($stmt->execute()) {
        echo json_encode([
        'success' => true, 
        'message' => 'Application submitted successfully!'
        ]);

    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'Database error: ' . $stmt->error
        ]);
    }

    
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Submission failed Please correct the errors below.',
        'errors' => $errors
    ]);
}

?>
