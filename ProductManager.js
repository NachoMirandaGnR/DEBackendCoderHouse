class ProductManager {
  products;
  static ultimoId = 0;
  constructor() {
    this.products = [];
  }

  addProduct({ title, description, price, thumbnail, code, stock = 15 }) {
    ProductManager.ultimoId++;
    const id = ProductManager.ultimoId;

    const isExist = this.isExist("code", code);
    if (isExist) throw new Error(`El código ingresado ya existe`);

    if (
      title.length === 0 ||
      description.length === 0 ||
      price.length === 0 ||
      thumbnail.length === 0 ||
      code.length === 0 ||
      stock.length === 0
    )
      throw new Error("Todos los campos son obligatorios");

    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(product);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) throw new Error("Producto no encontrado");

    return product;
  }

  isExist(key, value) {
    return this.products.find((product) => product[key] === value);
  }
}

const item = {
  title: "Guitarra Gibson Les Paul Prueba",
  description: "Guitarra Les Paul Prueba",
  price: 3000,
  thumbnail: "No Image",
  code: "GLP1",
  stock: 15,
};

const product = new ProductManager();
console.log(product.getProducts());
product.addProduct(item);
console.log(product.getProducts());
product.addProduct(item);
console.log(product.getProductById(1));
console.log(product.getProductById(2));
