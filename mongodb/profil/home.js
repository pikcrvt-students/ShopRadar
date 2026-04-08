app.get("/", (req, res) => {
    res.send(`
        <h2>Home</h2>

        <form method="POST" action="/register">
            <h3>Register</h3>
            <input name="lietotajvards" placeholder="Username" required><br>
            <input name="epasts" placeholder="Email" required><br>
            <input name="parole" type="password" placeholder="Password" required><br>
            <button name="register">Register</button>
        </form>

        <form method="POST" action="/login">
            <h3>Login</h3>
            <input name="epasts" placeholder="Email" required><br>
            <input name="parole" type="password" required><br>
            <button name="login">Login</button>
        </form>
    `);
});