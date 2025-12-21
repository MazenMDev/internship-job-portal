<?php
include './db_connection.php';
session_start();
header('Content-Type: application/json');
$statement = $conn->prepare('
  SELECT * FROM jobs
  WHERE is_deleted = 0
  LIMIT 3
');
$statement->execute();
$jobs = $statement->get_result();
$jobs = $jobs->fetch_all(MYSQLI_ASSOC);
for ($i = 0; $i < count($jobs); $i++) {
  $statement = $conn->prepare('
    SELECT company_name FROM company
    WHERE company_id = ?
    ');
  $statement->bind_param('i', $jobs[$i]['company_id']);
  $statement->execute();
  $company_name_result = $statement->get_result();
  $company_name = $company_name_result->fetch_assoc();
  $jobs[$i]['company_name'] = $company_name['company_name'];
}
$statement = $conn->prepare('
  SELECT 
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM company) as company_count
');
$statement->execute();
$counts = $statement->get_result();
$counts = $counts->fetch_assoc();
$tot = $counts['users_count'] + $counts['company_count'];
if ($counts['users_count'] >= 4) {
  $statement = $conn->prepare('
    SELECT Image, Id FROM users
    WHERE Image IS NOT NULL and Image != "profile.jpeg"
    LIMIT 4
  ');
  $statement->execute();
  $users = $statement->get_result();
  $users = $users->fetch_all(MYSQLI_ASSOC);
  for ($i = 0; $i < count($users); $i++) {
    $users[$i]['Image'] = '/ImageStorage/users/' . $users[$i]['Id'] . '/' . $users[$i]['Image'];
  }
}
echo json_encode(array(
  'status' => 'success',
  'jobs' => $jobs,
  'total_users_companies' => $tot,
  'users' => isset($users) ? $users : []
));
?>