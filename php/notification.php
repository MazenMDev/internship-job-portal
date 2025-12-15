<?php 
session_start();
include 'db_connection.php';

if ( !isset($_SESSION['type'])) {
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

if ( ($_SESSION["type"] === 'user')) {
$current_user_id = $_SESSION['user_id']; 
$current_receiver_type = 1;
}

else {
    $current_user_id = $_SESSION['company_id']; 
    $current_receiver_type = 2;
}


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