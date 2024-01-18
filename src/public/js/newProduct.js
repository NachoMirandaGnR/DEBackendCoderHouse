const socket = io();

socket.emit("connection", "nuevo cliente conectado");

document.getElementById("productForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const productTitle = document.getElementById("productTitle").value;
  const productDescription =
    document.getElementById("productDescription").value;
  const productPrice = document.getElementById("productPrice").value;
  const productThumbnail = document.getElementById("productThumbnail").value;
  const productStock = document.getElementById("productStock").value;
  const productCode = document.getElementById("productCode").value;
  const productCategory = document.getElementById("productCategory").value;

  // Enviar el producto al servidor a través del socket
  socket.emit("agregarProducto", {
    title: productTitle,
    description: productDescription,
    price: productPrice,
    thumbnail: productThumbnail,
    stock: productStock,
    code: productCode,
    category: productCategory,
  });
});
