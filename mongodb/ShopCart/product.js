const mongoose = require("../db");

const productSchema = new mongoose.Schema({
    nosaukums: String,
    cena: Number,
    attels: String
});

module.exports = mongoose.model("Product", productSchema);