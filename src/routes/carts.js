import express from "express";
import fs from "fs/promises";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { id, products } = req.body;
    const cart = { id, products };
    await fs.writeFile(`./carts/${id}.json`, JSON.stringify(cart, null, 2));
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cartData = await fs.readFile(`./carts/${cid}.json`, "utf8");
    const cart = JSON.parse(cartData);
    res.json(cart.products);
  } catch (error) {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cartData = await fs.readFile(`./carts/${cid}.json`, "utf8");
    const cart = JSON.parse(cartData);

    const productData = await fs.readFile(`./products/${pid}.json`, "utf8");
    const product = JSON.parse(productData);

    const existingProduct = cart.products.find((item) => item.product === pid);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await fs.writeFile(`./carts/${cid}.json`, JSON.stringify(cart, null, 2));
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

export default router;
