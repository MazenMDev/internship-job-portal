<?php
include '../db_connection.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$stmt = $conn->prepare(" SELECT
        a.application_id,
        a.user_id,
        u.First_Name      AS user_name,
        a.job_id,
        j.job_title       AS job_title,
        c.company_id,
        c.company_name,
        a.full_name       AS applicant_name,
        a.email,
        a.resume,
        a.experience_level,
        a.additional_note,
        a.cover_letter,
        a.application_date
    FROM job_applications a
    LEFT JOIN users   u ON a.user_id = u.Id
    LEFT JOIN jobs    j ON a.job_id = j.job_id
    LEFT JOIN company c ON j.company_id = c.company_id
    ORDER BY a.application_date DESC
");
if (!$stmt) {
    echo json_encode(['error' => 'Failed to prepare applications query']);
    exit;
}

$stmt->execute();
$result = $stmt->get_result();
if (!$result) {
    echo json_encode(['error' => 'Failed to retrieve applications']);
    exit;
}

$applications = [];
while ($row = $result->fetch_assoc()) {
    $applications[] = $row;
}

echo json_encode(['applications' => $applications]);
?>
