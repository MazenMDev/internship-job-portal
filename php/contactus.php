<?php  

    include './db_connection.php';
    
    session_start();
    header('Content-Type: application/json');

    $email=$_POST['email'];
    $message=$_POST['message'];
    $first_name=$_POST['firstname'];
    $last_name=$_POST['lastname']; 
    $user_id=null;
    $sql;
    if(!isset($_SESSION['user_id'])) {

        $user_id=$_SESSION['user_id'];
        $sql = "INSERT INTO contact_us (email, message, user_Id, first_name, last_name)
        VALUES (?, ?, ?, ?, ?)";
        $topdiff= $conn->prepare($sql);
        $topdiff->bind_param("ssiss", $email, $message, $user_id, $first_name, $last_name);
        if($topdiff->execute())
    {
        echo json_encode([
            "status"=>"success",
            "message"=> "we have recieved your message!"
        ]);
    }
    else
    {
        echo json_encode([
            "status"=> "error",
            'message'=> $topdiff->error

        ]);

    }

    }
    else{
        $sql = "INSERT INTO contact_us (email, message, first_name, last_name)
        VALUES (?, ?, ?, ?)";
        $topdiff= $conn->prepare($sql);
        $topdiff->bind_param("ssss", $email, $message, $first_name, $last_name);
        if($topdiff->execute())
    {
        echo json_encode([
            "status"=>"success",
            "message"=> "we have recieved your message!"
        ]);
    }
    else
    {
        echo json_encode([
            "status"=> "error",
            'message'=> $topdiff->error

        ]);

    }
    }

   
    

    
  

    

?>