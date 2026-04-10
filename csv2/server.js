const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.use(session({
    secret: "secret123",
    resave: false,
    saveUninitialized: true
}));

// ===== CSV HELPERS =====
function readCSV(file) {
    if (!fs.existsSync(file)) return [];

    const data = fs.readFileSync(file, "utf-8").trim();
    if (!data) return [];

    const [headers, ...rows] = data.split("\n");
    const keys = headers.split(",");

    return rows.map(row => {
        const values = row.split(",");
        let obj = {};
        keys.forEach((k, i) => obj[k] = values[i]);
        return obj;
    });
}

function writeCSV(file, data, headers) {
    const rows = [
        headers.join(","),
        ...data.map(obj => headers.map(h => obj[h]).join(","))
    ];
    fs.writeFileSync(file, rows.join("\n"));
}

// ===== FILES =====
const USERS_FILE = "users.csv";
const CART_FILE = "cart.csv";

// ===== INIT =====
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "id,username,email,password\n");
}

if (!fs.existsSync(CART_FILE)) {
    fs.writeFileSync(CART_FILE, "user_id,product_id,quantity\n");
}

// ===== ROUTES =====

// HOME
app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, '..', 'code', 'home.html'));
});

// REGISTER
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    let users = readCSV(USERS_FILE);

    if (users.find(u => u.email === email)) {
        return res.json({ ok: false, message: "User exists" });
    }

    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password
    };

    users.push(newUser);
    writeCSV(USERS_FILE, users, ["id", "username", "email", "password"]);

    req.session.user_id = newUser.id;

    res.json({ ok: true, user: newUser });
});

// LOGIN
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const users = readCSV(USERS_FILE);
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.json({ ok: false, message: "Invalid login" });
    }

    req.session.user_id = user.id;

    console.log(`\n===== USER INFO =====`);
console.log(`Username: ${user.username}`);
console.log(`Email: ${user.email}`);
console.log(`======================\n`);


    res.json({ ok: true, user });
});


// LOGOUT
app.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ ok: true });
});

// GET CURRENT USER
app.get("/api/me", (req, res) => {
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.json({ ok: false });
    }

    const users = readCSV(USERS_FILE);
    const user = users.find(u => u.id === user_id);

    if (!user) {
        return res.json({ ok: false });
    }

    res.json({
        ok: true,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

// ADD TO CART
app.post("/api/add-to-cart", (req, res) => {
    const user_id = req.session.user_id;
    if (!user_id) return res.json({ ok: false });

    let cart = readCSV(CART_FILE);
    const { product_id } = req.body;

    let item = cart.find(c => c.user_id === user_id && c.product_id === product_id);

    if (item) {
        item.quantity = parseInt(item.quantity) + 1;
    } else {
        cart.push({ user_id, product_id, quantity: 1 });
    }

    writeCSV(CART_FILE, cart, ["user_id", "product_id", "quantity"]);

    res.json({ ok: true });
});

// GET CART
app.get("/api/cart", (req, res) => {
    const user_id = req.session.user_id;
    if (!user_id) return res.json({ ok: false });

    const cart = readCSV(CART_FILE).filter(c => c.user_id === user_id);

    console.log(`\n===== USER CART =====`);
    cart.forEach(item => {
        console.log(`Product: ${item.product_id} | Quantity: ${item.quantity}`);    
    });
    console.log(`======================\n`);
    

    res.json({ ok: true, cart });
});


// START
app.listen(3001, () => {
    console.log("http://localhost:3001");
});