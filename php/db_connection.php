<?php

$conn = new mysqli("localhost", "root", "", "jobconnect-cs283project");

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit;
}
?>