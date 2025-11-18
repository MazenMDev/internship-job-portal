<?php
include './db_connection.php';
session_start();
header('Content-Type: application/json');
if(!isset($_SESSION['user_id'])){
    echo json_encode(array('error'=> 'User is not signed in'));
    exit;
}
$stat = $conn->prepare('SELECT user_id FROM company WHERE user-_id=?');
$stat->bind_param('i', $_SESSION['user_id']) ;
$stat->execute() ;
$result = $stat->get_result();
if($result->num_rows == 0){
    echo json_encode(array('error'=> 'user is not a company'));
    exit;
}
$statjob = $conn->prepare( 'SELECT jobs.*, job_skills.skill, job_tags.tag
FROM jobs
LEFT JOIN job_skills ON job_skills.job_id = jobs.job_id
LEFT JOIN job_tags  ON job_tags.job_id  = jobs.job_id
WHERE jobs.company_id = ? ');
$statjob->bind_param('i', $_SESSION['user_id']) ;
$statjob->execute() ;
$result = $statjob->get_result();
echo json_encode($result);    



?>