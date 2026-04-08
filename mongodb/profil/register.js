app.post("/register", async (req, res) => {
    try {
        const { lietotajvards, epasts, parole } = req.body;

        const hashedPassword = await bcrypt.hash(parole, 10);

        const newUser = new User({
            lietotajvards,
            epasts,
            parole: hashedPassword
        });

        await newUser.save();

        res.send("Reģistrācija veiksmīga! <a href='/'>Go Home</a>");
    } catch (err) {
        res.send("Kļūda: " + err.message);
    }
});