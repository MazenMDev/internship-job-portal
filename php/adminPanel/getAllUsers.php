<?php
    include '../db_connection.php';
    session_start();
    header('Content-Type: application/json');

    
    if(!isset($_SESSION['is_admin'] ) || $_SESSION['is_admin'] != 1) {
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }   

    $stmt = $conn->prepare("SELECT Id, First_Name , Last_Name , Email , Title , Image , cv , created_at , updated_at FROM users ");
      
      if($stmt->execute()){
          $result= $stmt->get_result();
          $users= [];

          while($row= $result->fetch_assoc()){
              $users[]= $row;
          }

          echo json_encode([
              'success' => true,
              'users' => $users
          ]);
      }
?>