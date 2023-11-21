import { Router } from "express";
import cartManager from "../dao/mongo/controllers/cartManager.js";

const cartRouter = Router();
const carts = new cartManager();
//nuevo carrito
cartRouter.post("/newCart", async (req, res) => {
  try {
    let cart = await carts.newCart();
    res.json({ message: "carrito creado", cart });
  } catch (err) {
    console.log(err);
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
    console.log(error);
  }
});

export default cartRouter;
