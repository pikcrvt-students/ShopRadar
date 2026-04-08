app.post("/login", async (req, res) => {
    const { epasts, parole } = req.body;

    const user = await User.findOne({ epasts });

    if (!user) {
        return res.send("Lietotājs nav atrasts");
    }

    const isMatch = await bcrypt.compare(parole, user.parole);

    if (isMatch) {
        req.session.user_id = user._id;
        req.session.username = user.lietotajvards;

        res.redirect("/profile");
    } else {
        res.send("Nepareiza parole");
    }
});