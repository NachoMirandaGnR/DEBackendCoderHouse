import express from "express";
import CartManager from "../controllers/cartManager.js";
import ProductManager from "../controllers/productManager.js";
r;

const router = express.Router();
const cartManager = new CartManager("./carts.json");
const productManager = new ProductManager("products.json");

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
    const cart = await cartManager.getCartById(cid).populate("products");
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

    const product = await productManager.getProductById(pid); // Obtiene el producto
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const cart = await cartManager.addProductToCart(cid, product, quantity); // Agrega el producto completo al carrito
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: "Error al agregar el producto al carrito" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: "La propiedad 'products' debe ser un arreglo" });
    }

    const updatedCart = await cartManager.updateCart(cid, products);
    res.json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Cantidad Invalida" });
    }

    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const cart = await cartManager.updateProductQuantity(
      cid,
      product,
      quantity
    );
    res.json(cart);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al actualizar la cantidad del producto" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await cartManager.removeProductFromCart(cid, product);
    res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    await cartManager.deleteCart(cid);
    res.json({ message: "Carrito eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

export default router;
