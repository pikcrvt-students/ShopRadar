app.post("/register", async (req, res) => {
    const users = await readCSV("users.csv");

    const { lietotajvards, epasts, parole } = req.body;

    const newUser = {
        id: Date.now().toString(),
        username: lietotajvards,
        email: epasts,
        password: parole
    };

    users.push(newUser);

    await writeCSV("users.csv", users, ["id", "username", "email", "password"]);

    res.json({ success: true });
});
