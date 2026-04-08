const mongoose = require("../db");

const userSchema = new mongoose.Schema({
    lietotajvards: { type: String, required: true },
    epasts: { type: String, required: true, unique: true },
    parole: { type: String, required: true },
    izveidots: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);