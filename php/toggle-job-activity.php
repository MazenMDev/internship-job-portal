<?php

include './db_connection.php';
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['type'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit();
}
if ($_SESSION['type'] !== 'company') {
    echo json_encode(["error" => "Only companies can toggle job activity"]);
    exit();
}
$company_id = $_SESSION['company_id'];

// ensure company exists for this user
$stmt = $conn->prepare("SELECT company_id FROM company WHERE company_id = ?");
$stmt->bind_param("i", $company_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Company not found"]);
    exit();
}

$job_id = (int) $_POST['job_id'];

// verify that the job belongs to the company of the logged in user
$stmt = $conn->prepare("
        SELECT j.job_id
        FROM jobs AS j
        JOIN company AS c ON j.company_id = c.company_id
        WHERE j.job_id = ? AND c.company_id = ?
    ");
$stmt->bind_param("ii", $job_id, $company_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Job not found or permission denied"]);
    exit();
}

// toggle the is_deleted variable
$stmt = $conn->prepare("UPDATE jobs SET is_deleted = NOT is_deleted WHERE job_id = ?");
$stmt->bind_param("i", $job_id);
$stmt->execute();
$stmt->close();

// fetch the current status (even if affected_rows === 0 we still want to return current value)
$stmt2 = $conn->prepare("SELECT is_deleted FROM jobs WHERE job_id = ?");
$stmt2->bind_param("i", $job_id);
$stmt2->execute();
$result2 = $stmt2->get_result();
$stmt2->close();

if ($row = $result2->fetch_assoc()) {
    echo json_encode(["success" => true, "is_deleted" => (int) $row['is_deleted']]);
} else {
    echo json_encode(["error" => "Job not found"]);
}


?>