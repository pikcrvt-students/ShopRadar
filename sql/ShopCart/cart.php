<?php
session_start();
include 'db.php';

$session_id = session_id();

$sql = "SELECT p.nosaukums, p.cena, g.daudzums, p.id
        FROM grozs g
        JOIN produkti p ON g.produkts_id = p.id
        WHERE g.session_id='$session_id'";

$result = $conn->query($sql);

$total = 0;

echo "<h2>Tavs grozs</h2>";

while ($row = $result->fetch_assoc()) {
    $sum = $row['cena'] * $row['daudzums'];
    $total += $sum;

    echo "<p>{$row['nosaukums']} - {$row['daudzums']} x {$row['cena']}€ = $sum €</p>";
    echo "<a href='remove.php?id={$row['id']}'>❌ Noņemt</a><br><br>";
}

echo "<h3>Kopā: $total €</h3>";