import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  user: {
    ref: "users",
    type: mongoose.Schema.Types.ObjectId,
  },
  products: [
    {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
      code: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
