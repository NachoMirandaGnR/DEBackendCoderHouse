import { Router } from "express";
import productManager from "../dao/mongo/controllers/productManager.js";
import { verifyToken, isAdmin, isPremium } from "../middlewares/authJWT.js";

const productRouter = Router();
const Manager = new productManager();
//getProductByCode
productRouter.get("/:code", async (req, res) => {
  const code = req.params.code;
  const product = await Manager.getProductByCode(code);
  res.json(product);
});
//getProducts
productRouter.get("/", async (req, res) => {
  const products = await Manager.getProducts();
  res.json(products);
});
//addProduct
productRouter.post(
  "/addnewProduct",
  [verifyToken, isAdmin, isPremium],
  async (req, res) => {
    const product = req.body;
    const newProduct = await Manager.addProduct(product);
    res.json(newProduct);
  }
);
// updateProductByCode
productRouter.put(
  "/:code",
  [verifyToken, isAdmin, isPremium],
  async (req, res) => {
    const code = req.params.code;
    const modified = req.body;
    const product = await Manager.updateProductByCode(code, modified);
    res.json(product);
  }
);
//deleteProduct
productRouter.delete(
  "/:code",
  [verifyToken, isAdmin, isPremium],
  async (req, res) => {
    const code = req.params.code;
    const product = await Manager.deleteProduct(code);
    res.json(product);
  }
);
export default productRouter;
