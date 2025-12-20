<?php
    include './db_connection.php';
    session_start();
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        $company_id = $_SESSION['company_id'] ?? null;
        
        if (!isset($company_id)) {
            echo json_encode(['success' => false, 'message' => 'User not authenticated.']);
            exit;
        }

        $checkCompanyStmt = $conn->prepare("SELECT company_id FROM company WHERE company_id = ?");
        $checkCompanyStmt->bind_param("i", $company_id);
        $checkCompanyStmt->execute();
        $checkCompanyStmt->store_result();
        if ($checkCompanyStmt->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'User is not registered as a company.']);
            exit;
        }
        $checkCompanyStmt->close();

        $title = $_POST['title'];
        $salary_min = (int)$_POST['salary_min'];
        $salary_max = (int)$_POST['salary_max'];
        $experience = $_POST['experience'];
        $location = $_POST['location'];
        $description = $_POST['description'];
        $job_type = $_POST['jobType'];
        $category = $_POST['category'];
        $skills = json_decode($_POST['skills'], true);
        $tags = json_decode($_POST['tags'], true);

        if(empty($title) || empty($salary_min) || empty($salary_max) || empty($experience) || empty($location) || empty($description) || empty($job_type) || empty($category)) {
            echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
            exit;
        }
        if(strlen($description) < 50) {
            echo json_encode(['success' => false, 'message' => 'Job description must be at least 50 characters long.']);
            exit;
        }
        if(strlen(($description)) > 2000) {
            echo json_encode(['success' => false, 'message' => 'Job description cannot exceed 5000 characters.']);
            exit;
        }

        if(count($skills) > 20) {
            echo json_encode(['success' => false, 'message' => 'You can add a maximum of 20 skills.']);
            exit;
        }
        if(count($tags) > 7) {
            echo json_encode(['success' => false, 'message' => 'You can add a maximum of 10 tags.']);
            exit;
        }


        $stmt = $conn->prepare("INSERT INTO jobs (company_id, job_title, salary_min, salary_max, experience, location, job_description, job_type, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
       
        $stmt->bind_param("isiisssss", $company_id, $title, $salary_min, $salary_max, $experience, $location, $description, $job_type, $category);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Job posted successfully.']);

            $stmt = $conn->prepare("SELECT job_id FROM jobs where company_id = ?");
            $stmt->bind_param( "i",$company_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if($result->num_rows > 0){
                $result = $result->fetch_assoc();
                $job_id = $result['job_id'];
            }

            $title_notif='A New job has been Posted';
            $desc_notif ='You have posted a new job for '.$title. ' postion ';
            $stmt = $conn->prepare("INSERT INTO notifications (receiver_type , receiver_id, sender_id,sender_type,title, description) VALUES (2, ?, ?, 3, ?, ?)");
            $stmt->bind_param("iiss",$company_id,$job_id, $title_notif,$desc_notif) ;
            if(!$stmt->execute()){
                echo json_encode([
                'success' => false, 
                'message' => 'error while sending notification: ' . $stmt->error
                 ]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error posting job: ' . $stmt->error]); 
        }
        
        foreach ($skills as $skill) {
            $skill_stmt = $conn->prepare("INSERT INTO job_skills (job_id, skill) VALUES (?, ?)");
            $skill_stmt->bind_param("is", $job_id, $skill);
            $skill_stmt->execute();
            $skill_stmt->close();
        }

        foreach ($tags as $tag) {
            $tag_stmt = $conn->prepare("INSERT INTO job_tags (job_id, tag) VALUES (?, ?)");
            $tag_stmt->bind_param("is", $job_id, $tag);
            $tag_stmt->execute();
            $tag_stmt->close();
        }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}