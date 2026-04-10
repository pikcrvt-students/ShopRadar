app.post("/login", async (req, res) => {
    const users = await readCSV("users.csv");

    const { email, password } = req.body;

    // Find user in CSV
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        req.session.user_id = user.id;
        return res.redirect("/profile");
    } else {
        return res.send("Login failed");
    }
});
