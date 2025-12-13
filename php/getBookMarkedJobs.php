<?php
    include 'db_connection.php';
    session_start();
    header('Content-Type: application/json');

    if($_SESSION['type'] !== 'user') {
        echo json_encode(["error" => "Only users can access bookmarked jobs"]);
        exit();
    }
    
    if(isset($_SESSION['user_id'])) {
        $user_id = intval($_SESSION['user_id']);

        $stmt = $conn->prepare("SELECT job_id FROM job_bookmarks WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $bookmarked_jobs = [];
        while ($row = $result->fetch_assoc()) {
            $bookmarked_jobs[] = intval($row['job_id']);
        }

        echo json_encode(["bookmarked_jobs" => $bookmarked_jobs]);
    } else {
        echo json_encode(["error" => "User not logged in"]);
    }
    
?>