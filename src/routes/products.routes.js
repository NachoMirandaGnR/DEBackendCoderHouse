import express from "express";
import ProductManager from "../controllers/productManager.js";

const router = express.Router();
const productManager = new ProductManager("products.json");

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    };

    const products = await productManager.getProducts(options);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(parseInt(pid));
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, code, stock, category, thumbnails } =
      req.body;

    const product = await productManager.addProduct({
      title,
      description,
      price,
      code,
      stock,
      category,
      thumbnails,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: "Error al agregar el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;

    const updatedProduct = await productManager.updateProduct(
      parseInt(pid),
      updatedFields
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await productManager.deleteProduct(parseInt(pid));
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// Ruta para buscar productos por categoría
router.get("/category/:category", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort } = req.query;
    const { category } = req.params;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query: { category },
    };

    const products = await productManager.getProducts(options);

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al cargar los productos por categoría" });
  }
});

// Ruta para buscar productos por disponibilidad
router.get("/availability/:available", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort } = req.query;
    const { available } = req.params;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query: { available: available === "true" },
    };

    const products = await productManager.getProducts(options);

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al cargar los productos por disponibilidad" });
  }
});

export default router;
