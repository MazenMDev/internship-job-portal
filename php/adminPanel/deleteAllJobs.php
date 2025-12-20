<?php
include '../db_connection.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] != 1) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if (!isset($_POST['action'])) {
    echo json_encode(['error' => 'Action not provided']);
    exit;
}

if (!isset($_POST['job_id'])) {
    echo json_encode(['error' => 'Job ID not provided']);
    exit;
}

$action = $_POST['action'];
$job_id = (int) $_POST['job_id'];

if ($action === 'toggle') {

    if (!isset($_POST['is_deleted'])) {
        echo json_encode(['error' => 'is_deleted value not provided']);
        exit;
    }

    $is_deleted = $_POST['is_deleted'] ? 1 : 0;

    $stmt = $conn->prepare("UPDATE jobs SET is_deleted = ? WHERE job_id = ?");
    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to prepare update statement'
        ]);
        exit;
    }

    $stmt->bind_param("ii", $is_deleted, $job_id);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => $is_deleted ? 'Job hidden from users' : 'Job made visible to users'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to update job visibility'
        ]);
    }
} else if ($action === 'delete') {
    $deleteApplications = $conn->prepare("DELETE FROM job_applications WHERE job_id = ?");
    if ($deleteApplications) {
        $deleteApplications->bind_param("i", $job_id);
        $deleteApplications->execute();
    }

    $stmt = $conn->prepare("DELETE FROM jobs WHERE job_id = ?");
    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to prepare delete statement'
        ]);
        exit;
    }

    $stmt->bind_param("i", $job_id);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Job deleted successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to delete job'
        ]);
    }
} else {

    echo json_encode(['error' => 'Invalid action']);
}
?>
