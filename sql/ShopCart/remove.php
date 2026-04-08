<?php
session_start();
include 'db.php';

$session_id = session_id();
$id = $_GET['id'];

$conn->query("DELETE FROM grozs WHERE produkts_id=$id AND session_id='$session_id'");

header("Location: cart.php");