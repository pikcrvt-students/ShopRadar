<?php
session_start();
include 'db.php';

if (isset($_POST['register'])) {

    $lietotajvards = $_POST['lietotajvards'];
    $epasts = $_POST['epasts'];
    $parole = password_hash($_POST['parole'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO lietotaji (lietotajvards, epasts, parole) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $lietotajvards, $epasts, $parole);

    if ($stmt->execute()) {
        echo "Reģistrācija veiksmīga! <a href='home.php'>Go Home</a>";
    } else {
        echo "Kļūda: " . $stmt->error;
    }
}
?>  