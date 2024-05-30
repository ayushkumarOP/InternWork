const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    type: { type: String, required: true },
    options: { type: [String], required: true }
});

const productsSchema = new mongoose.Schema ({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    variants: [variantSchema]
    },
    { timestamps: true }
);
module.exports = mongoose.model("Products", productsSchema);