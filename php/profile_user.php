<?php
include 'db_connection.php';
session_start();
header('Content-Type: application/json');

$userId = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$userId) { echo json_encode(["error" => "Not logged in"]); exit; }

    $input = json_decode(file_get_contents('php://input'), true);

    if ($input) {
        // --- 1. SAFER CHECK: Only update Basic Info if 'fname' is actually sent ---
        // We use array_key_exists to be 100% sure the key is in the JSON payload
        if (array_key_exists('fname', $input)) {
            $fname = $input['fname'] ?? '';
            $lname = $input['lname'] ?? '';
            $title = $input['title'] ?? '';
            $bio   = $input['bio']   ?? '';

            // Only update if we have at least a first name (safety net)
            if (!empty($fname)) {
                $stmt = $conn->prepare("UPDATE users SET First_Name=?, Last_Name=?, Title=?, Bio=? WHERE Id=?");
                $stmt->bind_param("ssssi", $fname, $lname, $title, $bio, $userId);
                $stmt->execute();
            }
        }

        // --- 2. Update Lists (Experience, Education, etc.) ---
        $tables = [
            'experience' => ['title', 'institution', 'start_date', 'end_date', 'description'],
            'education'  => ['title', 'institution', 'start_date', 'end_date', 'description'],
            'courses'    => ['title', 'institution', 'start_date', 'end_date', 'description'],
            'projects'   => ['title', 'institution', 'start_date', 'end_date', 'description'],
            'skills'     => ['skill', 'info'] 
        ];

        foreach ($tables as $tableName => $columns) {
            // Only touch the table if the specific list is included in the JSON
            if (isset($input[$tableName])) {
                // Delete old entries
                $conn->query("DELETE FROM $tableName WHERE user_id = $userId");

                // Insert new entries
                if (!empty($input[$tableName])) {
                    foreach ($input[$tableName] as $entry) {
                        $cols = ['user_id']; 
                        $vals = [$userId];
                        $types = "i"; 

                        foreach ($columns as $col) {
                            $cols[] = $col;
                            // Ensure we handle empty strings safely
                            $vals[] = isset($entry[$col]) ? $entry[$col] : '';
                            $types .= "s";
                        }

                        $colSql = implode(", ", $cols);
                        $valSql = implode(", ", array_fill(0, count($cols), "?"));
                        
                        $stmt = $conn->prepare("INSERT INTO $tableName ($colSql) VALUES ($valSql)");
                        $stmt->bind_param($types, ...$vals);
                        $stmt->execute();
                    }
                }
            }
        }
        echo json_encode(["success" => true]);
        exit;
    }
}

// ... (The GET section remains the same) ...
if (isset($_GET['id'])) {
    $targetId = intval($_GET['id']);
    $stmt = $conn->prepare("SELECT Id, First_Name, Last_Name, Email, Bio, Title, Image, cv FROM users WHERE Id = ?");
    $stmt->bind_param("i", $targetId);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    if ($data) {
        $data['is_owner'] = ($userId === $targetId);
        $tables = ['experience', 'education', 'courses', 'projects', 'skills'];
        foreach ($tables as $table) {
            $res = $conn->query("SELECT * FROM $table WHERE user_id = $targetId");
            $data[$table] = $res->fetch_all(MYSQLI_ASSOC);
        }
        echo json_encode($data);
    } else {
        echo json_encode(["error" => "User not found"]);
    }
}
?>