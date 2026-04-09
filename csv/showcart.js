app.get("/cart", async (req, res) => {
    if (!req.session.user_id) return res.redirect("/");

    const cart = await readCSV("cart.csv");
    const user_id = req.session.user_id;

    const userCart = cart.filter(c => c.user_id === user_id);

    let html = "<h2>Cart</h2>";

    userCart.forEach(item => {
        html += `
            <p>
                Product: ${item.product_id} | 
                Qty: ${item.quantity}
            </p>
        `;
    });

    res.send(html);
}); 