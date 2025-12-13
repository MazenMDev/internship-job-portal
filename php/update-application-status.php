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
        $stmt = $conn->prepare("SELECT company_id FROM jobs WHERE job_id = ?");
        $stmt->bind_param("i", $jobId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $companyId = $row['company_id'];
        $stmt->close();
        if($companyId != $_SESSION['company_id']) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized access to this application.']);
            exit;
        }

        $stmt = $conn->prepare("UPDATE job_applications SET status = ? WHERE application_id = ?");
        $stmt->bind_param("si", $newStatus, $applicationId);
        if($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Application status updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update application status.']);
        }
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    }
?>