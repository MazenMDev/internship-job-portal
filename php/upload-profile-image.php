<?php
session_start();
include 'db_connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}
$user_id = $_SESSION['user_id'];

if (!isset($_FILES['profile_image'])) {
    echo json_encode(["success" => false, "message" => "No file uploaded"]);
    exit;
}

$file = $_FILES['profile_image'];
$uploadDir = __DIR__ . "/../ImageStorage/$user_id/";

//0777 represents full permission , true makes parent directories if not exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
$fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($fileExt, $allowedTypes)) {
    echo json_encode(["success" => false, "message" => "Invalid file type"]);
    exit;
}

// delete existing profile images for this user
foreach ($allowedTypes as $ext) {
    foreach (glob($uploadDir . "profile_*.{$ext}") as $oldFile) {
        if (is_file($oldFile)) {
            @unlink($oldFile);
        }
    }
}
$filename = "profile_" . time() . ".$fileExt";
$targetPath = $uploadDir . $filename;

// move uploaded file
if (move_uploaded_file($file['tmp_name'], $targetPath)) {


    $stmt = $conn->prepare("UPDATE users SET Image = ? WHERE Id = ?");
    $stmt->bind_param("si", $filename, $user_id);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "image_url" => "../ImageStorage/$user_id/$filename"
    ]);
    $_SESSION['image'] = $filename;

} else {
    echo json_encode(["success" => false, "message" => "Failed to move file"]);
}
?>
