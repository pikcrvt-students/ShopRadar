<?php
$conn = new mysqli("localhost", "root", "", "shopcart");

if ($conn->connect_error) {
    die("Kļūda: " . $conn->connect_error);
}
?>