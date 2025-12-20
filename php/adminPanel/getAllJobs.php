<?php
include '../db_connection.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$stmt = $conn->prepare(" SELECT
        j.job_id,
        j.company_id,
        c.company_name,
        j.job_title        AS title,
        j.job_description,
        j.location,
        j.category,
        j.experience,
        j.job_type,
        j.is_deleted,
        j.salary_min       AS min_salary,
        j.salary_max       AS max_salary,
        j.created_at
    FROM jobs j
    LEFT JOIN company c ON j.company_id = c.company_id
");
if (!$stmt) {
    echo json_encode(['error' => 'Failed to prepare jobs query']);
    exit;
}

$stmt->execute();
$result = $stmt->get_result();
if (!$result) {
    echo json_encode(['error' => 'Failed to retrieve jobs']);
    exit;
}

$jobs = [];
while ($row = $result->fetch_assoc()) {
    $jobs[] = $row;
}

echo json_encode(['jobs' => $jobs]);
?>
