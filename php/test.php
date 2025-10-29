<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fname = test_input($_POST['fname']);
    $lname = test_input($_POST['lname']);
    $email = test_input($_POST["email"]);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $emailErr = "Invalid email format";
    }
    $password = test_input($_POST['password']);
    $confirm = test_input($_POST['confirm']);
    $gender = test_input($_POST['gender']);

    echo "First Name: " . $fname . "<br>";
    echo "Last Name: " . $lname . "<br>";
    if (isset($emailErr)) {
        echo $emailErr . "<br>";
    } else {
        echo "Email: " . $email . "<br>";
    }
    echo "Password: " . $password . "<br>";
    echo "Confirm Password: " . $confirm . "<br>";
    echo "Gender: " . $gender . "<br>";

} else {
    echo "No form data received.";
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>
