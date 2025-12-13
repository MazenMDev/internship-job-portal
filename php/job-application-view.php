<?php
include './db_connection.php';
    session_start();
    header('Content-Type: application/json');

    
    $company_id = $_SESSION['company_id'] ?? null;
    
    if (!$company_id) {
        echo json_encode(['status' => 'error', 'message' => 'company is not logged in.']);
        exit;
    }
    if($_SESSION['type'] !== 'company') {
        echo json_encode(['status' => 'error', 'message' => 'Only companies can view job applications.']);
        exit;
    }

    $jobid = (int) $_POST['jobid'];
    
    if (!$jobid) {
        echo json_encode(['status'=> 'error', 'message'=> 'wrong url input !']);
        exit;
    }
    $stmt =$conn->prepare('SELECT * FROM jobs WHERE company_id = ? and job_id = ?');
    $stmt->bind_param('ii', $company_id , $jobid);
    $stmt->execute();
    $job = $stmt->get_result();

    if ($job->num_rows === 0) {
        echo json_encode(['status'=> 'error', 'message'=> 'job not found or you are not the owner']);
        exit;
    }

    $stmt =$conn->prepare('SELECT * FROM job_applications where job_id = ? ');
    $stmt->bind_param('i', $jobid);
    $stmt->execute();
    $app = $stmt->get_result();
    if ($row = $app->fetch_assoc()) {
        echo json_encode(['status'=> 'success','message'=> 'retrived app data successfuly', 'data' => $row]);
        exit;
    }
    else{
         echo json_encode(['status'=> 'error', 'message'=> 'no applications found']);
         exit ;
    } 

        



?>