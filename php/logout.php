<?php
session_start();

// Clear session data
$_SESSION = [];
session_unset();
session_destroy();

header("Location: ../pages/login.html");
exit;
?>
