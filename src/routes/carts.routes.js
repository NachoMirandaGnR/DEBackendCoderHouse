import { Router } from "express";
import cartManager from "../dao/mongo/controllers/cartManager.js";
import jwt from "jsonwebtoken";
import userModel from "../dao/mongo/models/user.models.js";
import cartModel from "../dao/mongo/models/carts.models.js";
import * as dotenv from "dotenv";

dotenv.config();

const cartRouter = Router();
const carts = new cartManager();
//nuevo carrito
cartRouter.post("/newCart", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);

    const user = await userModel.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const cart = await carts.newCart(user, token);
    const cartId = cart._id;

    res.json({ message: "Carrito creado", cart });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//agregar producto al carrito
cartRouter.post("/:cid/product/:pcode", async (req, res) => {
  const { cid, pcode } = req.params;

  try {
    let cart = await carts.getCartsById(cid);
    if (!cart) {
      res.status(404).json({ error: "carrito no encontrado" });
    } else {
      let result = await carts.addProductToCart(cid, parseInt(pcode));
      res.json({ message: "producto agregado", result });
    }
  } catch (err) {
    console.log(err);
  }
});
//eliminar producto del carrito
cartRouter.delete("/:cid/product/:pcode", async (req, res) => {
  const { cid, pcode } = req.params;
  try {
    let cart = await carts.getCartsById(cid);
    if (!cart) {
      res.status(404).json({ error: "carrito no encontrado" });
    } else {
      let result = await carts.deleteFromCart(cid, parseInt(pcode));
      res.json({ message: "producto eliminado", result });
    }
  } catch (err) {
    console.log(err);
  }
});
// carrito por id
cartRouter.get("/:id", async (req, res) => {
  let idParam = req.params.id;
  try {
    let cart = await carts.getCartsById(idParam);
    if (!cart) {
      res.status(404).json({ error: "carrito no encontrado" });
    } else {
      res.json(cart);
    }
  } catch (err) {
    console.log(err);
  }
});
//todos los carritos
cartRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    let allCarts = await carts.getCarts();
    if (limit) {
      let temp = allCarts.filter((dat, index) => index < limit);
      res.json({ dat: temp, limit: limit, quantity: temp.length });
    } else {
      res.json(allCarts);
    }
  } catch (err) {
    console.log(err);
  }
});
//eliminar carrito por id
cartRouter.delete("/:id", async (req, res) => {
  let cart = await carts.deleteCart(req.params.id);
  res.json({ message: "carrito eliminado", cart });
});
cartRouter.put("/", async (req, res) => {
  try {
  } catch (error) {}
});
cartRouter.post("/:id/order", async (req, res) => {
  try {
    const { id } = req.params;
    const { order, idUser } = req.body;
    const idCart = await carts.getCartsById(id);
    if (!idCart) {
      res.status(404).json({ error: "carrito no encontrado" });
    } else {
      const result = await carts.submitOrder(idCart, order, req);
      //console.log("orden generada", result);
      res.json({ message: "orden generada", result });
    }
  } catch (error) {
    console.error(error);
  }
});
// vaciar carrito
cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    let cart = await carts.getCartsById(cid);
    if (!cart) {
      res.status(404).json({ error: "carrito no encontrado" });
    } else {
      await carts.deleteCart(cid);
      res.json({ message: "carrito vaciado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
cartRouter.post("/:cid/order", async (req, res) => {
  const { cid } = req.params; // Utiliza req.params en lugar de req.cookies.cartId
  try {
    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    await cartController.submitOrder(cid);

    res.json({ message: "Orden generada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar la orden" });
  }
});
export default cartRouter;
