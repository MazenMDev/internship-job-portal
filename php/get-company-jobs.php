<?php
include './db_connection.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['type'])) {
    echo json_encode(array('error' => 'not signed in'));
    exit;
}

$stat = $conn->prepare('SELECT company_id FROM company WHERE company_id=?');
$stat->bind_param('i', $_SESSION['company_id']);
$stat->execute();
$result = $stat->get_result();

if ($result->num_rows == 0) {
    echo json_encode(array('error' => 'User is not a company'));
    exit;
}

$company = $result->fetch_assoc();
$company_id = $company['company_id'];


$numApplications = $conn->prepare('
    SELECT COUNT(*) AS numApplications FROM job_applications
    JOIN jobs ON job_applications.job_id = jobs.job_id
    WHERE jobs.company_id = ?
');
$numApplications->bind_param('i', $company_id);
$numApplications->execute();
$result = $numApplications->get_result();
if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
    $num_applications = $data['numApplications'];
} else {
    $num_applications = 0;
}
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
while ($job = $result->fetch_assoc()) {
    $stmt = $conn->prepare('
        SELECT COUNT(*) AS num_applications FROM job_applications
        WHERE job_id = ?
    ');
    $stmt->bind_param('i', $job['job_id']);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows > 0) {
        $data = $res->fetch_assoc();
        $job['numApplications'] = $data['num_applications'];
    } else {
        $job['numApplications'] = 0;
    }
    $jobs[] = $job;
}

$stattags = $conn->prepare('
    SELECT tag FROM job_tags 
    WHERE job_id = ?
');

foreach ($jobs as &$job) {
    $stattags->bind_param('i', $job['job_id']);
    $stattags->execute();
    $tags = array();
    $result = $stattags->get_result();
    while ($tag = $result->fetch_assoc()) {
        $tags[] = $tag['tag'];
    }
    $job['tag'] = $tags;
}
$statskill = $conn->prepare('
    SELECT skill FROM job_skills
    WHERE job_id = ?
');
foreach ($jobs as &$job) {
    $statskill->bind_param('i', $job['job_id']);
    $statskill->execute();
    $skills = [];
    $result = $statskill->get_result();
    while ($skill = $result->fetch_assoc()) {
        $skills[] = $skill['skill'];
    }
    $job['skill'] = $skills;
}
$jobsData = array(
    'jobs' => $jobs,
    'num_applications' => $num_applications
);
echo json_encode($jobsData);
?>