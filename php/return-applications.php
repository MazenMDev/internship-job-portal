<?php

include './db_connection.php';

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['type'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit;
}

if($_SESSION['type'] !== 'user') {
    echo json_encode(['success' => false, 'message' => 'Only users can view their applications.']);
    exit;
}

$USER_ID = $_SESSION['user_id'];

$statment= $conn->prepare("SELECT * FROM job_applications WHERE user_id=?");
$statment->bind_param("i", $USER_ID);

if($statment->execute()){
    $result= $statment->get_result();
    $applications= [];

    while($row= $result->fetch_assoc()){
        $applications[]= $row;
    }

    echo json_encode([
        'success' => true,
        'applications' => $applications
    ]);
}

?>