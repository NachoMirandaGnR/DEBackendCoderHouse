import fs from "fs";
import productModel from "../models/products.models.js";
import CustomError, { enumErrors } from "../../../services/errors/enumError.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import userModel from "../models/user.models.js";

class productManager {
  products;
  product;
  constructor() {}
  async getProducts() {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener los productos",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }

  async addProduct(product) {
    try {
      dotenv.config();
      const token = req.cookies.token;

      const decodedToken = jwt.verify(token, process.env.SECRET);

      // Realiza una consulta a la base de datos para obtener el nombre de usuario a partir del ID del usuario
      const user = await userModel.findById(decodedToken.id);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      const username = user.username; // Obtiene el nombre de usuario
      console.log(username);
      const newProduct = new productModel(
        {
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail: product.thumbnail,
          stock: product.stock,
          code: product.code,
          category: product.category,
          creator: user.username,
        },
        { timestamps: true }
      );
      const productSave = await newProduct.save();
      return productSave;
    } catch (error) {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al agregar el producto",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }

  async getProductsByCode(code) {
    try {
      const productByCode = await productModel.findOne({ code: code });
      const productId = productByCode._id;
      const productById = await productModel.findById(productId);
      return productById;
    } catch {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener el producto",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }

  async deleteProduct(code) {
    try {
      const productByCode = await productModel.findOne({ code: code });
      const productId = productByCode._id;
      const deleteProductById = await productModel.findByIdAndDelete(productId);
      return deleteProductById;
    } catch (error) {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al obtener el producto",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }
  async updateProdcutByCode(code, modified) {
    try {
      const productById = await productModel.findByIdAndUpdate(code, modified);
      return productById;
    } catch (error) {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al modificar el producto",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }
  async removeStock(code, quantity) {
    try {
      const productById = await productModel.findById(code);
      productById.stock -= quantity;
      const productSave = await productById.save();
      return productSave;
    } catch (error) {
      CustomError.createError({
        name: "error en la base de datos",
        message: "error al modificar el producto",
        code: enumErrors.DATABASE_ERROR,
      });
    }
  }
}
export default productManager;
