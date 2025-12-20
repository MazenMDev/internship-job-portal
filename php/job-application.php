<?php

include './db_connection.php';

session_start();
header('Content-Type: application/json');

// IF REQUEST IS POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed.']);
    exit;
}

if($_SESSION['type'] !== 'user') {
    echo json_encode(['success' => false, 'message' => 'Only users can apply for jobs.']);
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
    $check_job = $conn->prepare("SELECT job_id , is_deleted FROM jobs WHERE job_id = ?");
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
    if($check_job->num_rows > 0){
        $check_job->bind_result($job_id, $is_deleted);
        $check_job->fetch();
        if($is_deleted){
            echo json_encode([
                'success' => false, 
                'message' => 'The job you are trying to apply for is no longer available.'
            ]);
            exit;
        }
    }
    $check_job->close();
    $application_data = [
        'user_id' => $_SESSION['user_id'],
        'job_id' => $job_id,
        'full_name' => $full_name,
        'email' => $email,
        'experience_level' => $experience_level,
        'cover_letter' => $cover_letter,
        'additional_note' => $note
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
        $stmt = $conn->prepare("SELECT job_title,company_id FROM jobs where job_id = ?");
        $stmt->bind_param( "i",$application_data['job_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0){
            $result = $result->fetch_assoc();
            $job_title = $result['job_title'];
            $company_id = intval($result['company_id']);
        }
        $stmt = $conn->prepare("SELECT company_name  from company where company_id = ?");
        $stmt->bind_param("i",$company_id);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0){
            $result = $result->fetch_assoc();
            $company_name = $result["company_name"];
        }
        $title_notif='Application Submitted';
        $desc_notif ='You have been Submitted a job application for  <a  target="_blank" style="color: var(--primary-color)" href="/pages/profile.html?id='. $company_id .'&type=company">'. $company_name .'</a>. , and for postion ' .$job_title;

        $stmt = $conn->prepare("INSERT INTO notifications (receiver_type , receiver_id, sender_id,sender_type,title, description) VALUES (1, ?, ?, 3, ?, ?)");
        $stmt->bind_param("iiss",$application_data['user_id'],$application_data['job_id'], $title_notif,$desc_notif) ;
        $stmt->execute();

        if(!isset($_SESSION["unread_notifications"])){
            $_SESSION["unread_notifications"] = 0;
        }
        $_SESSION["unread_notifications"] = ($_SESSION["unread_notifications"] + 1);

        $stmt = $conn->prepare("SELECT job_title,company_id FROM jobs where job_id = ?");
        $stmt->bind_param( "i",$application_data['job_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows > 0){
            $result = $result->fetch_assoc();
            $job_title = $result['job_title'];
            $company_id = intval($result['company_id']);
        }

        $title_notif='New Job Application';
        $desc_notif ='user '.$application_data['full_name']. ' has applied for '.$job_title .' position <a target="_blank" style="color: var(--primary-color)" href="/pages/job-application-view.html?jobId='.$application_data['job_id'].'">View Application</a>';


        $stmt = $conn->prepare("INSERT INTO notifications (receiver_type , receiver_id, sender_id,sender_type,title, description) VALUES (2, ?, ?, 3, ?, ?)");
        $stmt->bind_param("iiss",$company_id,$application_data['job_id'], $title_notif,$desc_notif) ;
        if(!$stmt->execute()){
            echo json_encode([
            'success' => false, 
            'message' => 'error while sending notification: ' . $stmt->error
        ]);
        }
        

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