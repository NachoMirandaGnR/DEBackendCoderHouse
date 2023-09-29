const mongoose = require("mongoose");

// Definir el esquema para los productos
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: [{ type: String }],
  status: { type: Boolean, default: true },
});

// Crear un modelo a partir del esquema
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
