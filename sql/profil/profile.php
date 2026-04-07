<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    die("Nav autorizēts!");
}

$id = $_SESSION['user_id'];
$sql = "SELECT * FROM lietotaji WHERE id=$id";
$result = $conn->query($sql);
$user = $result->fetch_assoc();
?>

<h2>Tavs profils</h2>
<p>Lietotājvārds: <?php echo $user['lietotajvards']; ?></p>
<p>Epasts: <?php echo $user['epasts']; ?></p>