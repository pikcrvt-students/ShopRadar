<?php include 'db.php'; ?>

<form method="POST">
    Lietotājvārds: <input type="text" name="lietotajvards"><br>
    Epasts: <input type="email" name="epasts"><br>
    Parole: <input type="password" name="parole"><br>
    <button type="submit" name="register">Reģistrēties</button>
</form>

<?php
if (isset($_POST['register'])) {
    $lietotajvards = $_POST['lietotajvards'];
    $epasts = $_POST['epasts'];
    $parole = password_hash($_POST['parole'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO lietotaji (lietotajvards, epasts, parole)
            VALUES ('$lietotajvards', '$epasts', '$parole')";

    if ($conn->query($sql)) {
        echo "Reģistrācija veiksmīga!";
    } else {
        echo "Kļūda: " . $conn->error;
    }
}
?>