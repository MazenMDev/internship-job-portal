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

$statement = $conn->prepare("SELECT * FROM job_applications where user_id = ?");
$statement->bind_param("i", $user_id);

if($statement->execute())
{
    $result = $statement->get_result();
    $applications = [];
    while($row = $result->fetch_assoc())
    {
        $statement_job = $conn->prepare("SELECT * FROM jobs WHERE job_id = ?");
        $statement_job->bind_param("i", $row['job_id']);
        $statement_job->execute();
        $result_job = $statement_job->get_result();
        if($job = $result_job->fetch_assoc())
        {
            $row['job'] = $job;
        }

        $statement_job->close();
        $statement_company = $conn->prepare("SELECT company_name , company_email , company_url , image FROM company WHERE company_id = ?");
        $statement_company->bind_param("i", $job['company_id']);
        $statement_company->execute();
        $result_company = $statement_company->get_result();
        if($company = $result_company->fetch_assoc())
        {
            $row['company'] = $company;
        }

        $statement_company->close();

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