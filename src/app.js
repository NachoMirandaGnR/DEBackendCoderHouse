import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const port = 8080;

const products = [
  {
    id: 1,
    title: "Guitarra eléctrica Gibson Les Paul",
    description: "Guitarra eléctrica modelo Les Paul de la marca Gibson",
    price: 1999.99,
    thumbnail: "guitar1.jpg",
    code: "LP100",
    stock: 10,
  },
  {
    id: 2,
    title: "Guitarra acústica Taylor 214ce",
    description: "Guitarra acústica de la marca Taylor, modelo 214ce",
    price: 1499.99,
    thumbnail: "guitar2.jpg",
    code: "T214CE",
    stock: 5,
  },
  {
    id: 3,
    title: "Guitarra eléctrica Fender Stratocaster",
    description: "Guitarra eléctrica modelo Stratocaster de la marca Fender",
    price: 1599.99,
    thumbnail: "guitar3.jpg",
    code: "STRATO",
    stock: 8,
  },
  {
    id: 4,
    title: "Batería Pearl Export Series",
    description: "Batería acústica Pearl Export Series con acabado brillante",
    price: 1399.99,
    thumbnail: "drums1.jpg",
    code: "PEARL",
    stock: 3,
  },
  {
    id: 5,
    title: "Teclado Yamaha P-45",
    description: "Teclado digital Yamaha P-45 con teclas contrapesadas",
    price: 799.99,
    thumbnail: "keyboard1.jpg",
    code: "P45",
    stock: 7,
  },
  {
    id: 6,
    title: "Violín Stradivarius",
    description: "Violín profesional modelo Stradivarius hecho a mano",
    price: 5000.0,
    thumbnail: "violin1.jpg",
    code: "STRAD",
    stock: 2,
  },
  {
    id: 7,
    title: "Piano de cola Steinway & Sons",
    description: "Piano de cola Steinway & Sons de concierto, calidad premium",
    price: 20000.0,
    thumbnail: "piano1.jpg",
    code: "STEINWAY",
    stock: 1,
  },
  {
    id: 8,
    title: "Saxofón Yamaha YAS-280",
    description: "Saxofón alto Yamaha YAS-280 para estudiantes y profesionales",
    price: 999.99,
    thumbnail: "saxophone1.jpg",
    code: "YAS280",
    stock: 4,
  },
  {
    id: 9,
    title: "Trompeta Bach Stradivarius",
    description: "Trompeta profesional Bach Stradivarius, tono brillante",
    price: 1699.99,
    thumbnail: "trumpet1.jpg",
    code: "BACHTRUMP",
    stock: 6,
  },
  {
    id: 10,
    title: "Contrabajo Cremona SB-3",
    description: "Contrabajo Cremona SB-3, sonido cálido y potente",
    price: 2499.99,
    thumbnail: "doublebass1.jpg",
    code: "CREMCONTRAB",
    stock: 3,
  },
];

const productManager = new ProductManager(products);

app.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      return res.json(limitedProducts);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar los productos" });
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(parseInt(pid));
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.listen(port, () => {
  console.log(`Server corriendo en el puerto ${port}`);
});
