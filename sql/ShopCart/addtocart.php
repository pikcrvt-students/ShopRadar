<?php
session_start();
include 'db.php';

$session_id = session_id();
$produkts_id = $_GET['id'];

// pārbauda vai jau ir grozā
$sql = "SELECT * FROM grozs WHERE produkts_id=$produkts_id AND session_id='$session_id'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $conn->query("UPDATE grozs SET daudzums = daudzums + 1 WHERE produkts_id=$produkts_id AND session_id='$session_id'");
} else {
    $conn->query("INSERT INTO grozs (produkts_id, daudzums, session_id)
                  VALUES ($produkts_id, 1, '$session_id')");
}

header("Location: cart.php");