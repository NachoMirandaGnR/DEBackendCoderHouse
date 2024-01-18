import ProductManager from "./productManager.js";
import cartModel from "../models/carts.models.js";

import userModel from "../models/user.models.js";
import { transporter } from "../../../config/mailing.config.js";
import productModel from "../models/products.models.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

class CartManager {
  async getCarts() {
    try {
      const carts = await cartModel.find().lean();
      return carts;
    } catch (error) {
      console.error(error);
    }
  }

  async newCart(user, token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const userId = decodedToken.id;

      const cart = await cartModel.create({ products: [], user: userId });

      user.cartId = cart._id;
      await user.save();

      return cart;
    } catch (error) {
      console.error(error);
      throw new Error("Error al crear el carrito");
    }
  }

  async getCartsById(id) {
    try {
      const cart = await cartModel.findById(id);
      return cart;
    } catch (error) {
      console.error(error);
    }
  }

  async addProductToCart(idCart, codeProduct) {
    try {
      const cart = await this.getCartsById(idCart);

      if (!cart) {
        console.error("No existe el carrito");
      }

      const productManager = new ProductManager();
      const products = await productManager.getProducts();
      const product = products.find((e) => e.code === codeProduct);
      const productExist = cart.products.find((e) => e.code === codeProduct);

      if (!productExist) {
        cart.products.push({ ...product, quantity: 1 });
      } else {
        productExist.quantity += 1;
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteFromCart(idCart, codeProduct) {
    try {
      const cart = await this.getCartsById(idCart);

      if (!cart) {
        console.error("No existe el carrito");
      }

      const productExist = cart.products.find((e) => e.code === codeProduct);

      if (productExist) {
        if (productExist.quantity > 1) {
          productExist.quantity -= 1;
        } else {
          cart.products = cart.products.filter((e) => e.code !== codeProduct);
        }

        await cart.save();
      }

      return cart;
    } catch (error) {
      console.error(error);
    }
  }

  submitOrder = async (cartId, req) => {
    try {
      const token = req.cookies.token;
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const user = decodedToken.id;
      // Obtener el carrito del usuario
      const userCart = await cartModel.findById(cartId);

      if (!userCart) {
        throw new Error("El carrito no fue encontrado.");
      }

      const products = userCart.products;

      // Enviar correo con detalles de la compra
      await transporter.sendMail({
        from: '"Resumen de Compra" <abadiajoaquin04@gmail.com>',
        to: user.email, // Asegúrate de tener acceso a la variable `user` aquí
        subject: "Resumen de Compra",
        text: "Muchas gracias por comprar en GameFusion. ¡Esperamos que disfrutes tu compra!",
        html: `
          <h1>Gracias por su compra</h1>
          <h3>Detalles de su compra</h3>
          <ul>
            ${products
              .map(
                (product) => `
                <li>
                  Título: ${product.title}<br>
                  Precio: $${product.price}<br>
                  Cantidad: ${product.quantity}<br>
                </li>
              `
              )
              .join("")}
            <li>Usuario: ${user.username}</li> 
          </ul>
        `,
      });

      // Descontar stock de productos
      for (const product of products) {
        const productExist = await productModel.findById(product._id);
        if (productExist) {
          productExist.stock -= product.quantity;
          await productExist.save();
        }
      }

      // Otros procesamientos después de enviar la orden
    } catch (error) {
      console.error(error);
      throw new Error("Error al procesar la orden");
    }
  };
}

export default CartManager;
