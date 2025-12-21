<?php
include './db_connection.php';
session_start();
header('Content-Type: application/json');
$statement = $conn->prepare('
  SELECT * FROM jobs
  WHERE is_deleted = 0
  ORDER BY created_at DESC
');
if ($statement->execute()) {
  $jobs = $statement->get_result();
  $jobs = $jobs->fetch_all(MYSQLI_ASSOC);

  for ($i = 0; $i < count($jobs); $i++) {
    $statement = $conn->prepare('
      SELECT company_name , Image, company_url FROM company
      WHERE company_id = ?
      ');
    $statement->bind_param('i', $jobs[$i]['company_id']);
    if ($statement->execute()) {
      $company = $statement->get_result();
      $company = $company->fetch_assoc();
      $jobs[$i]['company_name'] = $company['company_name'];
      $jobs[$i]['logo'] = $company['Image'];
      $jobs[$i]['website'] = $company['company_url'];
    } else {
      echo json_encode(array(
        'status' => 'error',
        'message' => 'Failed to fetch company name'
      ));
      exit();
    }
    $statement = $conn->prepare('
      SELECT skill FROM job_skills
      WHERE job_id = ?
      ');
    $statement->bind_param('i', $jobs[$i]['job_id']);
    if ($statement->execute()) {
      $skills = $statement->get_result();
      $skills = $skills->fetch_all(MYSQLI_ASSOC);
      $jobs[$i]['skills'] = array();
      for ($j = 0; $j < count($skills); $j++) {
        array_push($jobs[$i]['skills'], $skills[$j]['skill']);
      }
    } else {
      echo json_encode(array(
        'status' => 'error',
        'message' => 'Failed to fetch skills'
      ));
      exit();
    }

    $statement = $conn->prepare('
      SELECT tag FROM job_tags
      WHERE job_id = ? 
      ');
    $statement->bind_param('i', $jobs[$i]['job_id']);
    if ($statement->execute()) {
      $tags = $statement->get_result();
      $tags = $tags->fetch_all(MYSQLI_ASSOC);
      $jobs[$i]['tags'] = array();
      for ($k = 0; $k < count($tags); $k++) {
        array_push($jobs[$i]['tags'], $tags[$k]['tag']);
      }
    } else {
      echo json_encode(array(
        'status' => 'error',
        'message' => 'Failed to fetch tags'
      ));
      exit();
    }
  }
  echo json_encode(array(
    'status' => 'success',
    'data' => $jobs
  ));
} else {
  echo json_encode(array(
    'status' => 'error',
    'message' => 'Failed to fetch jobs'
  ));
}
?>