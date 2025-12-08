<?php
include './db_connection.php';
    session_start();
    header('Content-Type: application/json');
    $user_id = $_SESSION['user_id'] ?? null;
    if (!$user_id) {
        echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
        exit;
    }
    $jobid = (int) $_POST['jobid'];
    if (!$jobid) {
        echo json_encode(['status'=> 'error', 'message'=> 'wrong url input !']);
        exit;
    }
    $stmt =$conn->prepare('SELECT * FROM jobs WHERE company_id = ? and job_id = ?');
    $stmt->bind_param('ii', $user_id , $jobid);
    $stmt->execute();
    $job = $stmt->get_result();

    if ($job->num_rows === 0) {
        echo json_encode(['status'=> 'error', 'message'=> 'somthing went wrong']);
        exit;
    }

    $stmt =$conn->prepare('SELECT * FROM job_applications where job_id = ? and user_id =?');
    $stmt->bind_param('ii', $jobid , $user_id);
    $stmt->execute();
    $app = $stmt->get_result();
    if ($row = $app->fetch_assoc()) {
        echo json_encode(['status'=> 'success','message'=> 'retrived app data successfuly', $row]);
        exit;
    }
    else{
         echo json_encode(['status'=> 'error', 'message'=> 'no applications found']);
         exit ;
    } 

        



?>