<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: home.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Profile</title>
</head>
<body>
    <h1>Welcome to your profile!</h1>
    <p>Your ID: <?php echo $_SESSION['user_id']; ?></p>

    <a href="home.php">Home</a><br>
    <a href="logout.php">Logout</a>
</body>
</html>
