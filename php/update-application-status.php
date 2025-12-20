<?php
    include 'db_connection.php';
    session_start();
    header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        if($_SESSION['type'] !== 'company') {
            echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
            exit;
        }
        $applicationId = $_POST['application_id'];
        $newStatus = $_POST['new_status'];

        if($newStatus !== 'Accepted' && $newStatus !== 'Rejected') {
            echo json_encode(['success' => false, 'message' => 'Invalid status value.']);
            exit;
        }

        $stmt = $conn->prepare("SELECT job_id FROM job_applications WHERE application_id = ?");
        $stmt->bind_param("i", $applicationId);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Application not found.']);
            exit;
        }
        $row = $result->fetch_assoc();
        $jobId = $row['job_id'];
        $stmt->close();
        $stmt = $conn->prepare("SELECT company_id, job_title FROM jobs WHERE job_id = ?");
        $stmt->bind_param("i", $jobId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $companyId = $row['company_id'];
        $job_title = $row['job_title'];
        $stmt->close();
        if($companyId != $_SESSION['company_id']) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized access to this application.']);
            exit;
        }
        $stmt = $conn->prepare("SELECT company_name FROM company WHERE company_id = ?");
        $stmt->bind_param("i", $companyId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $company_name = $row['company_name'];
       
        $stmt = $conn->prepare("UPDATE job_applications SET status = ? WHERE application_id = ?");
        $stmt->bind_param("si", $newStatus, $applicationId);
        if($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Application status updated successfully.']);
            $stmt = $conn->prepare("SELECT user_id from job_applications  where job_id = ?");
            $stmt->bind_param("i",$jobId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if($result->num_rows > 0){
                $result = $result->fetch_assoc();
                $user_id = $result["user_id"];
            }
            $job_status = $newStatus;
            if($job_status === 'Accepted'){
                $title_notif='Your application has been accepted !';
                $desc_notif ='Your application for the  '.$job_title. ' postion at '.$company_name .' has been accpeted <a target="_blank" style="color: var(--primary-color)" href="/pages/job-application-view.html?jobId='.$jobId.'">View Application</a>';
            }
            else{
                $title_notif='Your application has been rejected !';
                $desc_notif ='Your application for the  '.$job_title. ' postion at '.$company_name .' has been rejected <a target="_blank" style="color: var(--primary-color)" href="/pages/job-application-view.html?jobId='.$jobId.'">View Application</a>';
            }
            $stmt = $conn->prepare("INSERT INTO notifications (receiver_type , receiver_id, sender_id,sender_type,title, description) VALUES (1, ?, ?, 2, ?, ?)");
            $stmt->bind_param("iiss",$user_id,$companyId, $title_notif,$desc_notif) ;
            if(!$stmt->execute()){
                echo json_encode([
             'success' => false, 
             'message' => 'error while sending notification: ' . $stmt->error
             ]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update application status.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    }
?>