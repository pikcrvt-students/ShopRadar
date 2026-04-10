const fs = require("fs");

// ===== CSV READER =====
function readCSV(file) {
    if (!fs.existsSync(file)) return [];

    const data = fs.readFileSync(file, "utf-8").trim();
    if (!data) return [];

    const lines = data.split("\n").filter(line => line.trim() !== "");
    const [headers, ...rows] = lines;
    const keys = headers.split(",");

    return rows.map(row => {
        const values = row.split(",");
        let obj = {};
        keys.forEach((k, i) => obj[k] = values[i]);
        return obj;
    });
}

const USERS_FILE = "users.csv";
const CART_FILE = "cart.csv";


// ===== TERMINAL MENU =====
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log("\n===== ADMIN PANEL =====");
    console.log("1 — Show all users");
    console.log("2 — Show one user");
    console.log("3 — Show user cart");
    console.log("0 — Exit");
    console.log("========================");

    readline.question("Choose option: ", handleChoice);
}

function handleChoice(choice) {
    switch (choice) {
        case "1":
            showAllUsers();
            break;
        case "2":
            askUserId();
            break;
        case "3":
            askCartUserId();
            break;
        case "0":
            console.log("Exiting...");
            readline.close();
            return;
        default:
            console.log("Invalid option");
    }
    showMenu();
}

// ===== FUNCTIONS =====
function showAllUsers() {
    const users = readCSV(USERS_FILE);
    console.log("\n===== ALL USERS =====");
    users.forEach(u => {
        console.log(`ID: ${u.id} | Username: ${u.username} | Email: ${u.email}`);
    });
    console.log("======================\n");
}

function askUserId() {
    readline.question("Enter user ID: ", id => {
        const users = readCSV(USERS_FILE);
        const user = users.find(u => u.id === id);

        if (!user) {
            console.log("User not found");
        } else {
            console.log("\n===== USER INFO =====");
            console.log(`ID: ${user.id}`);
            console.log(`Username: ${user.username}`);
            console.log(`Email: ${user.email}`);
            console.log("======================\n");
        }
    });
}

function askCartUserId() {
    readline.question("Enter user ID: ", id => {
        const cart = readCSV(CART_FILE).filter(c => c.user_id === id);

        if (cart.length === 0) {
            console.log("Cart empty or user not found");
        } else {
            console.log("\n===== USER CART =====");
            cart.forEach(item => {
                console.log(`Product: ${item.product_id} | Quantity: ${item.quantity}`);
            });
            console.log("======================\n");
        }
    });
}

// ===== START MENU =====
showMenu();
