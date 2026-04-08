const mongoose = require("../db");

const cartSchema = new mongoose.Schema({
    produkts_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    daudzums: Number,
    session_id: String
});

module.exports = mongoose.model("Cart", cartSchema);