const mongoose = require("mongoose");

// Definir el esquema para el carrito de compras
const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Cambiamos a ObjectId y hacemos referencia al modelo Product
      quantity: { type: Number, required: true },
    },
  ],
});

// Crear un modelo a partir del esquema
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
