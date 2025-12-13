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
    
    if ($app->num_rows > 0) {
        $jobData = $job->fetch_assoc();

        $companyName = $_SESSION['company_name'] ?? 'Unknown Company';
        $jobData['company_name'] = $companyName;

        $Skills_stmt = $conn->prepare('SELECT skill FROM job_skills WHERE job_id = ?');
        $Skills_stmt->bind_param('i', $jobid);
        $Skills_stmt->execute();
        $skills_result = $Skills_stmt->get_result();
        $skills = array();
        while ($skill_row = $skills_result->fetch_assoc()) {
            $skills[] = $skill_row['skill'];
        }
        $jobData['skillsRequired'] = $skills;

        $tags_stmt = $conn->prepare('SELECT tag FROM job_tags WHERE job_id = ?');
        $tags_stmt->bind_param('i', $jobid);
        $tags_stmt->execute();
        $tags_result = $tags_stmt->get_result();
        $tags = array();
        while ($tag_row = $tags_result->fetch_assoc()) {
            $tags[] = $tag_row['tag'];
        }
        $jobData['tags'] = $tags;

        $applications = array();
        while ($value = $app->fetch_assoc()) {
            $applicantId = $value['user_id'];
            $user_stmt = $conn->prepare('SELECT First_Name, Last_Name, Image , cv FROM users WHERE Id = ?');
            $user_stmt->bind_param('i', $applicantId);
            $user_stmt->execute();
            $user_result = $user_stmt->get_result();
            if ($user_row = $user_result->fetch_assoc()) {
                $value['name'] = $user_row['First_Name'] . ' ' . $user_row['Last_Name'];
                $value['image'] = $user_row['Image'];
                $value['resume'] = $user_row['cv'];
            } else {
                $value['name'] = 'Unknown Applicant';
                $value['image'] = 'profile.jpeg';
                $value['resume'] = null;
            }
            $applications[] = $value;
        }

        echo json_encode(['status'=> 'success','message'=> 'retrived app data successfuly', 'data' => $applications , 'job' => $jobData ]);
        exit;
    }
    else{
         echo json_encode(['status'=> 'error', 'message'=> 'no applications found']);
         exit ;
    } 

        



?>