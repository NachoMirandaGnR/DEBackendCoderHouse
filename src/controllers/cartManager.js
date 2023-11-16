import fs from "fs/promises";

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getCartById(cartId) {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      const carts = JSON.parse(data);
      const cart = carts.find((cart) => cart.id === cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      return cart;
    } catch (error) {
      throw new Error("Error al Cargar el carrito");
    }
  }

  async createCart() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      const carts = JSON.parse(data);

      const cartId = Date.now().toString();

      const newCart = {
        id: cartId,
        products: [],
      };

      carts.push(newCart);

      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), "utf8");

      return newCart;
    } catch (error) {
      throw new Error("Error al crear el Carrito");
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      const carts = JSON.parse(data);

      const cartIndex = carts.findIndex((cart) => cart.id === cartId);

      if (cartIndex === -1) {
        throw new Error("Carrito no encontrado");
      }

      const cart = carts[cartIndex];

      const productIndex = cart.products.findIndex(
        (product) => product.productId === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), "utf8");

      return cart;
    } catch (error) {
      throw new Error("Error al añadir un producto al carrito");
    }
  }
}

export default CartManager;
