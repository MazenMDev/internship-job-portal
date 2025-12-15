<?php 
session_start();
include 'db_connection.php';

if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
    echo json_encode(["error" => "Not logged in"]);
    exit;
}


$current_user_id = $_SESSION['user_id']; 
$current_receiver_type = $_SESSION['role'];


$stmt = $conn->prepare("SELECT * FROM notifications 
                        WHERE receiver_id = ? 
                        AND receiver_type = ?
                        ORDER BY created_at");


$stmt->bind_param("ii", $current_user_id, $current_receiver_type);

$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

header('Content-Type: application/json');
echo json_encode($notifications);
?>