app.get("/cart", async (req, res) => {
    const session_id = req.sessionID;

    const items = await Cart.find({ session_id }).populate("produkts_id");

    let total = 0;
    let html = "<h2>Tavs grozs</h2>";

    items.forEach(item => {
        const product = item.produkts_id;
        const sum = product.cena * item.daudzums;
        total += sum;

        html += `
            <p>
                ${product.nosaukums} - 
                ${item.daudzums} x ${product.cena}€ = ${sum}€
            </p>
            <a href="/remove/${product._id}">❌ Noņemt</a><br><br>
        `;
    });

    html += `<h3>Kopā: ${total} €</h3>`;
    html += `<a href="/">Atpakaļ</a>`;

    res.send(html);
});