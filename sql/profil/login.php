<?php
session_start();
include 'db.php';

if (isset($_POST['login'])) {

    $epasts = $_POST['epasts'];
    $parole = $_POST['parole'];

    $stmt = $conn->prepare("SELECT id, parole FROM lietotaji WHERE epasts = ?");
    $stmt->bind_param("s", $epasts);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($parole, $user['parole'])) {
            $_SESSION['user_id'] = $user['id'];
            header("Location: home.php");
            exit;
        } else {
            echo "Nepareiza parole";
        }
    } else {
        echo "Lietotājs nav atrasts";
    }
}
?>

