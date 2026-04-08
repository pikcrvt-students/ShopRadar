app.get("/remove/:id", async (req, res) => {
    const session_id = req.sessionID;
    const id = req.params.id;

    await Cart.deleteOne({
        produkts_id: id,
        session_id
    });

    res.redirect("/cart");
});