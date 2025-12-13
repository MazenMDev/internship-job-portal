<?php
session_start();

include 'db_connection.php';

if (isset($_POST['theme'])) {
  $_SESSION['theme'] = $_POST['theme'];
  if(!isset($_SESSION['type'])) {
      exit();
  }
  $table = '';
  $id = null;
  $id_column = '';
  if($_SESSION['type'] === 'user') {
      $table = 'users';
      $id = $_SESSION['user_id'];
      $id_column = 'Id';
  } elseif($_SESSION['type'] === 'company') {
      $table = 'company';
      $id = $_SESSION['company_id'];
      $id_column = 'company_id';
  } else {
      exit();
  }

  $query = "UPDATE $table SET theme = ? WHERE $id_column = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("si", $_SESSION['theme'], $id);
  $stmt->execute();
}
?>