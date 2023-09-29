const mongoose = require("mongoose");

// Definir el esquema para el carrito de compras
const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

// Crear un modelo a partir del esquema
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
