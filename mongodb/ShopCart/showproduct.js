app.get("/", async (req, res) => {
    const products = await Product.find();

    let html = "<h2>Produkti</h2>";

    products.forEach(p => {
        html += `
            <div>
                <h3>${p.nosaukums}</h3>
                <p>Cena: ${p.cena}€</p>
                <a href="/add-to-cart/${p._id}">Pievienot grozam</a>
            </div><hr>
        `;
    });

    html += `<a href="/cart">🛒 Skatīt grozu</a>`;

    res.send(html);
});