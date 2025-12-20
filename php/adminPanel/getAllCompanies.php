<?php

#get all companies , number of jobs posted for each and number of applications for each company
    include '../db_connection.php';
    session_start();
    header('Content-Type: application/json');
   
    if(!isset($_SESSION['is_admin'] ) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }   
    $stmt = $conn->prepare( "SELECT company_id , company_name , phone_number
    , street_address , city , state , zip_code , country , company_url , created_at , Image FROM company");
    $stmt->execute();
    $result = $stmt->get_result();
    if(!$result) {
        echo json_encode(['error' => 'Failed to retrieve companies']);
        exit;
    }
    $companies = [];
    while($row = $result->fetch_assoc()) {
        $companies[] = $row;
        $stmt = $conn->prepare("SELECT job_id FROM jobs WHERE company_id = ?");
        $stmt->bind_param("i", $row['company_id']);
        $stmt->execute();
        $job_result = $stmt->get_result();
        if(!$job_result) {
            echo json_encode(['error' => 'Failed to retrieve jobs for company ID ' . $row['company_id']]);
            exit;
        }
        
        $jobs = [];
        $total_applications = 0;
        while($job_row = $job_result->fetch_assoc()) {
            $jobs[] = $job_row['job_id'];
            $stmt = $conn->prepare("SELECT COUNT(*) as application_count FROM job_applications WHERE job_id = ?");
            $stmt->bind_param("i", $job_row['job_id']);
            $stmt->execute();
            $app_result = $stmt->get_result();
            $app_row = $app_result->fetch_assoc();
            if(!$app_result) {
                echo json_encode(['error' => 'Failed to retrieve applications for job ID ' . $job_row['job_id']]);
                exit;
            }
            
            $total_applications += $app_row['application_count'];
        }
        $companies[count($companies)-1]['total_jobs'] = count($jobs);
        $companies[count($companies)-1]['total_applications'] = $total_applications;

    }
    echo json_encode(['companies' => $companies]);


?>