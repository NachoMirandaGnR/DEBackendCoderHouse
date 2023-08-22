const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct({ title, description, price, thumbnail, code, stock = 15 }) {
    const products = this.getProductsFromFile();
    const id = products.length + 1;

    const isExist = products.find((product) => product.code === code);
    if (isExist) throw new Error(`El código ingresado ya existe`);

    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    products.push(product);

    this.saveProductsToFile(products);

    return product;
  }

  getProducts() {
    return this.getProductsFromFile();
  }

  getProductById(id) {
    const products = this.getProductsFromFile();
    const product = products.find((product) => product.id === id);

    if (!product) throw new Error("Producto no encontrado");

    return product;
  }

  updateProduct(id, updatedFields) {
    const products = this.getProductsFromFile();
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) throw new Error("Producto no encontrado");

    const updatedProduct = { ...products[productIndex], ...updatedFields };
    products[productIndex] = updatedProduct;

    this.saveProductsToFile(products);

    return updatedProduct;
  }

  deleteProduct(id) {
    let products = this.getProductsFromFile();
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) throw new Error("Producto no encontrado");

    products.splice(productIndex, 1);

    this.saveProductsToFile(products);
  }

  getProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveProductsToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products), "utf8");
  }
}

module.exports = ProductManager;
