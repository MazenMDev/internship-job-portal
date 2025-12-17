<?php

session_start();
include 'db_connection.php';

header('Content-Type: application/json');

if(!isset($_SESSION['type']))
{
  echo json_encode(['success' => 'false', 'message' => 'User not logged in']);
    exit;
}

if($_SESSION['type'] !== 'user')
{
  echo json_encode(['success' => 'false', 'message' => 'only users can view applications']);
    exit;
}

$user_id = $_SESSION['user_id'];

$statement = $conn->prepare("SELECT * FROM job_applications, applications where user_id = ?");
$statement->bind_param("i", $user_id);

if($statement->execute())
{
    $result = $statement->get_result();
    $applications = [];
    while($row = $result->fetch_assoc())
    {
        $applications[] = $row;
    }
    echo json_encode([
        'success' => 'true', 
        'applications' => $applications
    ]);
}
else
{
    echo json_encode([
        'success' => 'false', 
        'message' => 'failed to fetch applications'
    ]);
}

$statement->close();
$conn->close();

?>