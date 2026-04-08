app.get("/add-to-cart/:id", async (req, res) => {
    const session_id = req.sessionID;
    const produkts_id = req.params.id;

    const existing = await Cart.findOne({ produkts_id, session_id });

    if (existing) {
        existing.daudzums += 1;
        await existing.save();
    } else {
        await Cart.create({
            produkts_id,
            daudzums: 1,
            session_id
        });
    }

    res.redirect("/cart");
});