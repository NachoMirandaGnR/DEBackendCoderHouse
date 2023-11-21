import fs from "fs";
import ProductManager from "./productManager.js";

class cartManager {
  id;
  carts;
  #path = "";
  constructor(path) {
    this.#path = path;
    this.carts = [];
    this.id = 0;
  }
  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.#path, "utf-8");
      //console.log(JSON.parse(carts));
      return JSON.parse(carts);
    } catch {
      return [];
    }
  }
  async newCart() {
    this.carts = await this.getCarts();
    this.carts.push({ products: [], id: this.carts.length + 1 });
    console.log(this.carts);
    const result = await fs.promises.writeFile(
      "./carts.json",
      JSON.stringify(this.carts)
    );
    // console.log(result, "soy el result");
  }

  async getCartsById(id) {
    const carts = await this.getCarts();

    // console.log(carts, "soy el getCarts de getCartsById");
    const cart = carts.filter((e) => e.id === id);
    // console.log(cart, "soy el getCartsById");
    if (!cart || cart === undefined) {
      throw new Error("debe ingresar un id de carrito existente");
    } else {
      return cart;
    }
  }
  async addProductToCart(idCart, codeProduct) {
    let cart = await this.getCartsById(idCart);
    // console.log(cart, "soy el cart");
    if (!cart) {
      throw new Error("no existe carrito");
    }
    let productManager = new ProductManager();
    let products = await productManager.getProducts();
    // let products = JSON.parse(fs.readFileSync("./products.json"));
    // console.log(products, "soy el products");
    const product = products.filter((e) => e.code === codeProduct);
    console.log(product, "soy el product");
    console.log(cart, "soy el cart");
    cart[0].products.push({
      id: codeProduct,
      quantity: 1,
    });
    fs.promises.writeFile(this.#path, JSON.stringify(cart));
  }

  async deleteCart(id) {
    let carts = await this.getCarts();
    let searchIdDelete = carts.map((i) => i.id !== id);
    await fs.promises.writeFile(this.#path, JSON.stringify(searchIdDelete));
    console.log("carrito eliminado con éxito");
  }
}

// const main = async () => {
//   const manager = new cartManager("../../carts.json");
//   await manager.addProductToCart(1, 4);
//   await manager.getCartsById(3);
//   await manager.getCarts();
// };

// main();
export default cartManager;
