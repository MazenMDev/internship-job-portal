<?php
include './db_connection.php';
session_start();
header('Content-Type: application/json');

if(!isset($_SESSION['user_id'])){
    echo json_encode(array('error'=> 'User is not signed in'));
    exit;
}

$stat = $conn->prepare('SELECT user_id FROM company WHERE user_id=?');
$stat->bind_param('i', $_SESSION['user_id']);
$stat->execute();
$result = $stat->get_result();

if($result->num_rows == 0){
    echo json_encode(array('error'=> 'User is not a company'));
    exit;
}

$company = $result->fetch_assoc();
$company_id = $company['user_id']; 

// Get jobs
$statjob = $conn->prepare('
    SELECT * FROM jobs
    WHERE company_id = ?
    ORDER BY created_at DESC
');
$statjob->bind_param('i', $company_id);
$statjob->execute();
$result = $statjob->get_result();
$jobs = array();
while($job = $result->fetch_assoc()){
    $jobs[] = $job;
}
$stattags = $conn->prepare('
    SELECT tag FROM job_tags 
    WHERE job_id = ?
');

foreach($jobs as & $job){
    $stattags->bind_param('i', $job['job_id']);
    $stattags->execute();
    $tags =array();
    $result = $stattags->get_result();
    while($tag = $result->fetch_assoc()){
        $tags[] = $tag['tag'];
    }
    $job['tag'] = $tags;
}
$statskill = $conn->prepare('
    SELECT skill FROM job_skills
    WHERE job_id = ?
');
foreach($jobs as & $job){
    $statskill->bind_param('i', $job['job_id']);
    $statskill->execute();
    $skill =array();
    $result = $statskill->get_result();
    while($skill = $result->fetch_assoc()){
        $skills[] = $skill['skill'];
    }
    $job['skill'] = $skills;
}
echo json_encode($job);
?>
