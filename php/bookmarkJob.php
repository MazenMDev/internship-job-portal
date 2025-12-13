<?php
    include 'db_connection.php';
    session_start();
    header('Content-Type: application/json');

    if($_SESSION['type'] === 'company'){
        echo json_encode(["error" => "Companies cannot bookmark jobs"]);
        exit;
    }
    
    if(isset($_SESSION['user_id']) && isset($_POST['job_id'])) {
        $user_id = intval($_SESSION['user_id']);
        $job_id = intval($_POST['job_id']);

        $check_stmt = $conn->prepare("SELECT * FROM job_bookmarks WHERE user_id = ? AND job_id = ?");
        $check_stmt->bind_param("ii", $user_id, $job_id);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();

        if ($check_result->num_rows > 0) {
            $delete_stmt = $conn->prepare("DELETE FROM job_bookmarks WHERE user_id = ? AND job_id = ?");
            $delete_stmt->bind_param("ii", $user_id, $job_id);
            if ($delete_stmt->execute()) {
                echo json_encode(["status" => "removed"]);
            } else {
                echo json_encode(["error" => "Failed to remove bookmark"]);
            }
        } else {
            $insert_stmt = $conn->prepare("INSERT INTO job_bookmarks (user_id, job_id) VALUES (?, ?)");
            $insert_stmt->bind_param("ii", $user_id, $job_id);
            if ($insert_stmt->execute()) {
                echo json_encode(["status" => "added"]);
            } else {
                echo json_encode(["error" => "Failed to add bookmark"]);
            }
        }
    } else {
        echo json_encode(["error" => "User not logged in or job ID not provided"]);
    }