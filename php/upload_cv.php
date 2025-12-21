<?php

    include './db_connection.php';
    session_start();
    header('Content-Type: application/json');
    
    # Check if a file was uploaded
    # UPLOAD_ERR_OK means there is no error with the upload
    if (!isset($_FILES['cv_file']) || $_FILES['cv_file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error.']);
        exit;
    }
    if(!isset($_SESSION['type']) || $_SESSION['type'] !== 'user') {
        echo json_encode(['success' => false, 'message' => 'Only users can upload CVs.']);
        exit;
    }
    
    $file = $_FILES['cv_file'];
    $user_id = $_SESSION['user_id'] ?? null;
    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => 'User not logged in.']);
        exit;
    }
    # Validate file type (only allow PDF or word)
    $allowed_types = ['application/pdf' , 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!in_array($file['type'], $allowed_types)) {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only PDF and Word documents are allowed.']);
        exit;
    }


    # Create directory for user if it doesn't exist
    $upload_dir = __DIR__ . "/../CVStorage/$user_id/";
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    # get older cv and delete it if it exists
    $stmt = $conn->prepare("SELECT cv FROM users WHERE Id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $old_cv = $row['cv'];
        if ($old_cv && file_exists($upload_dir . $old_cv)) {
            unlink($upload_dir . $old_cv);
        }
    }
    
    $target_path = $upload_dir . $file['name'];
    # Move the uploaded file to the target directory
    if (move_uploaded_file($file['tmp_name'], $target_path)) {
        # Update the database with the CV file name
        $stmt = $conn->prepare("UPDATE users SET CV = ? WHERE Id = ?");
        $stmt->bind_param("si", $file['name'], $user_id);
        $stmt->execute();
        
        echo json_encode(['success' => true, 'message' => 'CV uploaded successfully.', 'cv_url' => "../CVStorage/$user_id/" . $file['name']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file.']);
    }

?>