import express from "express";
import expressHandlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { __dirname } from "./utils.js";
import Cart from "./dao/models/Cart.js";
import Message from "./dao/models/Message.js";
import Product from "./dao/models/Product.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;

mongoose
  .connect(
    "mongodb+srv://ignaciomiranda1180:Nacho7931456$@cluster0.llqpd8m.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Conexión a MongoDB establecida correctamente");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });

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

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);

app.get("/realtimeproducts", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await Product.find().limit(parseInt(limit) || undefined);

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

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
