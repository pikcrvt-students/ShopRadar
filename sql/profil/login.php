<?php
session_start();
include 'db.php';
?>

<form method="POST">
    Epasts: <input type="email" name="epasts"><br>
    Parole: <input type="password" name="parole"><br>
    <button type="submit" name="login">Pieslēgties</button>
</form>

<?php
if (isset($_POST['login'])) {
    $epasts = $_POST['epasts'];
    $parole = $_POST['parole'];

    $sql = "SELECT * FROM lietotaji WHERE epasts='$epasts'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($parole, $user['parole'])) {
            $_SESSION['user_id'] = $user['id'];
            echo "Pieslēgšanās veiksmīga!";
        } else {
            echo "Nepareiza parole!";
        }
    } else {
        echo "Lietotājs nav atrasts!";
    }
}
?>