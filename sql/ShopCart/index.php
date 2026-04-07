<?php include 'db.php'; session_start(); ?>

<h2>Produkti</h2>

<?php
$result = $conn->query("SELECT * FROM produkti");

while ($row = $result->fetch_assoc()) {
    echo "<div>";
    echo "<h3>{$row['nosaukums']}</h3>";
    echo "<p>Cena: {$row['cena']}€</p>";
    echo "<a href='add_to_cart.php?id={$row['id']}'>Pievienot grozam</a>";
    echo "</div><hr>";
}
?>

<a href="cart.php">🛒 Skatīt grozu</a>