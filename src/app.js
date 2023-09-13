import express from "express";
import expressHandlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;

app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main",
    extname: ".handlebars",
  })
);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.static("public"));

// Rutas de productos
app.use("/api/products", productsRouter);

// Rutas de carritos
app.use("/api/carts", cartsRouter);

app.get("/realtimeproducts", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      return res.render("realTimeProducts", { products: limitedProducts });
    }

    res.render("realTimeProducts", { products });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al cargar los productos en tiempo real" });
  }
});

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

// Inicia el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
