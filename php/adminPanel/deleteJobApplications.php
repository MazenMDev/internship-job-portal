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

if (!isset($_POST['application_id'])) {
    echo json_encode(['error' => 'Application ID not provided']);
    exit;
}

$action = $_POST['action'];
$application_id = (int) $_POST['application_id'];

if ($action === 'delete') {

    $stmt = $conn->prepare("DELETE FROM job_applications WHERE application_id = ?");
    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to prepare delete statement'
        ]);
        exit;
    }

    $stmt->bind_param("i", $application_id);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Application deleted successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to delete application'
        ]);
    }

} else {

    echo json_encode(['error' => 'Invalid action']);

}
?>
