import express from "express";
import ProductManager from "./ProductManager.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

const app = express();
const port = 8080;

const productManager = new ProductManager("./products.json");

app.use(express.json());

// Rutas de productos
app.use("/api/products", productsRouter);

// Rutas de carritos
app.use("/api/carts", cartsRouter);

app.listen(port, () => {
  console.log(`Server corriendo en el puerto ${port}`);
});
