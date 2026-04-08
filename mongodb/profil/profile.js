app.get("/profile", (req, res) => {
    if (!req.session.user_id) {
        return res.redirect("/");
    }

    res.send(`
        <h1>Welcome to your profile!</h1>
        <p>Your ID: ${req.session.user_id}</p>

        <a href="/">Home</a><br>
        <a href="/logout">Logout</a>
    `);
});