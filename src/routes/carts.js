import express from "express";
import CartManager from "../CartManager.js";

const router = express.Router();
const cartManager = new CartManager("./carts.json");

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: "Cart no encontrado" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Cantidad Invalida" });
    }

    const cart = await cartManager.addProductToCart(cid, pid, quantity);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: "Error al agregar el producto al carrito" });
  }
});

export default router;
