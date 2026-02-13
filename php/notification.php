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

$stmt = $conn->prepare("UPDATE notifications 
                        SET seen = 1 
                        WHERE receiver_user_id = ? 
                        AND receiver_type = ?");

$stmt->bind_param("ii", $current_user_id, $current_receiver_type);
$stmt->execute();

$stmt = $conn->prepare("SELECT * FROM notifications 
                        WHERE receiver_user_id = ? 
                        AND receiver_type = ?
                        ORDER BY created_at DESC");


$stmt->bind_param("ii", $current_user_id, $current_receiver_type);

$stmt->execute();
$result = $stmt->get_result();
}

else {
    $current_user_id = $_SESSION['company_id']; 
    $current_receiver_type = 2;
    
    $stmt = $conn->prepare("UPDATE notifications 
                            SET seen = 1 
                            WHERE receiver_company_id = ? 
                            AND receiver_type = ?");
    
    $stmt->bind_param("ii", $current_user_id, $current_receiver_type);
    $stmt->execute();
    
    $stmt = $conn->prepare("SELECT * FROM notifications 
                            WHERE receiver_company_id = ? 
                            AND receiver_type = ?
                            ORDER BY created_at DESC");
    
    
    $stmt->bind_param("ii", $current_user_id, $current_receiver_type);
    
    $stmt->execute();
    $result = $stmt->get_result();
}


$notifications = [];

while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
    $sender_type = $row['sender_type'];
    $sender_type = intval($sender_type);
    if ($sender_type === 1) {
        $sender_id = $row['sender_user_id'];
        $stmt_sender = $conn->prepare("SELECT Image FROM users WHERE user_id = ?");
        $stmt_sender->bind_param("i", $sender_id);
        $res = $stmt_sender->execute();
        $result_sender = $stmt_sender->get_result();
        $path = '/ImageStorage/profile.jpeg'; 
        if($result_sender->num_rows > 0){
            $result_sender = $result_sender->fetch_assoc();
            $image = $result_sender['Image'];
            if($image && $image != 'profile.jpeg'){
                $path = '/ImageStorage/users/'.$sender_id.'/'.$image;
            }
        }
        $notifications[count($notifications)-1]['image'] = $path;
        
    } else if ($sender_type === 2) {
        $sender_id = $row['sender_company_id'];
        $stmt_sender = $conn->prepare("SELECT Image FROM company WHERE company_id = ?");
        $stmt_sender->bind_param("i", $sender_id);
        $res = $stmt_sender->execute();
        $result_sender = $stmt_sender->get_result();
        $path = '/ImageStorage/company.png';
        if($result_sender->num_rows > 0){
            $result_sender = $result_sender->fetch_assoc();
            $img = $result_sender['Image'];
            if($img && $img != 'company.png'){
                $path = '/ImageStorage/companies/'.$sender_id.'/'.$img;
            }
        }
        $notifications[count($notifications)-1]['image'] = $path;
        }
        else{
            $sender_id = $row['sender_job_id'];
            $get_id = $conn->prepare("SELECT company_id FROM jobs WHERE job_id = ?");
            $get_id->bind_param("i", $sender_id);
            $get_id->execute();
            $result_id = $get_id->get_result();
            if($result_id->num_rows > 0){
                $result_id = $result_id->fetch_assoc();
                $sender_id = $result_id['company_id'];
            }
            $stmt_sender = $conn->prepare("SELECT Image FROM company WHERE company_id = ?");
            $stmt_sender->bind_param("i", $sender_id);
            $res = $stmt_sender->execute();
            $result_sender = $stmt_sender->get_result();
            $path = '/ImageStorage/company.png';
            if($result_sender->num_rows > 0){
                $result_sender = $result_sender->fetch_assoc();
                $img = $result_sender['Image'];
                if($img && $img != 'company.png'){
                    $path = '/ImageStorage/companies/'.$sender_id.'/'.$img;
                }
            }
            $notifications[count($notifications)-1]['image'] = $path;

        }
}

header('Content-Type: application/json');
echo json_encode($notifications);
?>