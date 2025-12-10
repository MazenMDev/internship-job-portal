<?php

include './db_connection.php';

session_start();
header('Content-Type: application/json');

// IF REQUEST IS POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed.']);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in. Please log in to apply.']);
    exit;
}

// Check if job_id is provided
if (empty($_POST['job_id'])) {
    echo json_encode(['success' => false, 'message' => 'Job ID not provided.']);
    exit;
}

$errors = [];
$success = false;

// FULL NAME VALIDATION
if(empty(trim($_POST['full-name']?? '')))
{
    $errors['full-name']= "Full Name is required.";
}else{
    $full_name= filter_var(trim($_POST['full-name']), FILTER_SANITIZE_STRING);
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

if(empty(trim($_POST['cover-letter']?? ''))){
    $errors['cover-letter']="Cover letter is required";
}else{
    $cover_letter= filter_var(trim($_POST['cover-letter']), FILTER_SANITIZE_STRING);
}

// additional note
$note = filter_var($_POST['note'] ?? '', FILTER_SANITIZE_STRING);


// ex level validation
$valid_levels = ['entry-level', 'mid-level', 'senior-level'];
if (empty($_POST['experience-level'] ?? '') || !in_array($_POST['experience-level'], $valid_levels)) {
    $errors['experience-level'] = "Experience Level selection is invalid or missing.";
} else {
    $experience_level = filter_var($_POST['experience-level'], FILTER_SANITIZE_STRING);
}


//$resume = null;
//if(empty($_POST['resume'] ?? '')){
//    $errors['resume']="Resume upload is required.";
//}else{
//    $resume = $_POST['resume'];
//}

if (empty($errors)) {
    $job_id = (int)$_POST['job_id'];
    
    // Check if job exists
    $check_job = $conn->prepare("SELECT job_id FROM jobs WHERE job_id = ?");
    $check_job->bind_param("i", $job_id);
    $check_job->execute();
    $check_job->store_result();
    
    if ($check_job->num_rows === 0) {
        echo json_encode([
            'success' => false, 
            'message' => 'The job you are trying to apply for does not exist.'
        ]);
        exit;
    }
    $check_job->close();
    
    $application_data = [
        'user_id' => $_SESSION['user_id'],
        'job_id' => $job_id,
        'full_name' => $full_name,
        'email' => $email,
        'experience_level' => $experience_level,
        'cover_letter' => $cover_letter,
        'additional_note' => $note,
        //'resume' => $resume
    ];

    $check_application = $conn->prepare("SELECT application_id FROM job_applications WHERE user_id = ? AND job_id = ?");
    $check_application->bind_param("ii", $application_data['user_id'], $application_data['job_id']);
    $check_application->execute();
    $check_application->store_result();

    if($check_application->num_rows > 0){
        echo json_encode([
            'success' => false, 
            'message' => 'You have already applied for this job.'
        ]);
        exit;
    }

    $check_application->close();

    $stmt = $conn->prepare("INSERT INTO job_applications (user_id, job_id, full_name, email, experience_level, cover_letter, additional_note) VALUES (?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param(
        "iisssss",
        $application_data['user_id'],
        $application_data['job_id'],
        $application_data['full_name'],
        $application_data['email'],
        $application_data['experience_level'],
        $application_data['cover_letter'],
        $application_data['additional_note']
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
        'message' => "Submission failed Please correct the errors below. " . json_encode($errors),
        'errors' => $errors
    ]);
}

?>
