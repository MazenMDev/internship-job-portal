<?php
session_start();
include 'db_connection.php';

if (!isset($_SESSION['type'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

$id = null;
$type = $_SESSION['type'];
$table = '';
$idColumn = '';
if ($type === 'user') {
    $id = $_SESSION['user_id'];
    $table = 'users';
    $idColumn = 'Id';
} elseif ($type === 'company') {
    $id = $_SESSION['company_id'];
    $table = 'company';
    $idColumn = 'company_id';
} else {
    echo json_encode(["success" => false, "message" => "Invalid user type"]);
    exit;
}

if (!isset($_FILES['profile_image'])) {
    echo json_encode(["success" => false, "message" => "No file uploaded"]);
    exit;
}

$file = $_FILES['profile_image'];
if($type === 'company') {
    $uploadDir = __DIR__ . "/../ImageStorage/companies/$id/";
}
else {
    $uploadDir = __DIR__ . "/../ImageStorage/users/$id/";
}

//0777 represents full permission , true makes parent directories if not exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
//pathinfo( , PATHINFO_EXTENSION) gets the file extension then convert to lower case 
$fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($fileExt, $allowedTypes)) {
    echo json_encode(["success" => false, "message" => "Invalid file type"]);
    exit;
}

// delete existing profile images for this user
//loop through allowed types and delete any existing files
foreach ($allowedTypes as $ext) {
    // use glob to find files matching the pattern (profile_(extentsion))
    foreach (glob($uploadDir . "profile_*.{$ext}") as $oldFile) {
        // check if file exists and delete it
        if (is_file($oldFile)) {
            // @unlink deletes the file
            @unlink($oldFile);
        }
    }
}
$filename = "profile_" . time() . ".$fileExt";
$targetPath = $uploadDir . $filename;

// move uploaded file
if (move_uploaded_file($file['tmp_name'], $targetPath)) {


    $stmt = $conn->prepare("UPDATE $table SET Image = ? WHERE $idColumn = ?");
    $stmt->bind_param("si", $filename, $id);
    $stmt->execute();

    $fullUrl = '';
    if($type === 'company') {
        $fullUrl = "../ImageStorage/companies/$id/$filename";
    }
    else {
        $fullUrl = "../ImageStorage/users/$id/$filename";
    }
    echo json_encode([
        "success" => true,
        "image_url" => $fullUrl
    ]);
    $_SESSION['image'] = $filename;

} else {
    echo json_encode(["success" => false, "message" => "Failed to move file"]);
}
?>
