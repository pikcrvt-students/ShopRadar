app.get("/add-to-cart/:id", async (req, res) => {
    if (!req.session.user_id) return res.redirect("/");

    const cart = await readCSV("cart.csv");
    const user_id = req.session.user_id;
    const product_id = req.params.id;

    const item = cart.find(c => 
        c.user_id === user_id && c.product_id === product_id
    );

    if (item) {
        item.quantity = parseInt(item.quantity) + 1;
    } else {
        cart.push({
            user_id,
            product_id,
            quantity: 1
        });
    }

    writeCSV("cart.csv", cart, ["user_id", "product_id", "quantity"]);

    res.redirect("/cart");
});