<?php
session_start();

include 'db_connection.php';

if (isset($_POST['theme'])) {
  $_SESSION['theme'] = $_POST['theme'];
  $query = "UPDATE users SET theme = ? WHERE id = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("si", $_SESSION['theme'], $_SESSION['user_id']);
  $stmt->execute();
}
?>