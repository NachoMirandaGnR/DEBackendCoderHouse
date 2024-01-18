const postToCart = async (code, carrito) => {
  try {
    const response = await fetch(`/api/cart/${carrito}/product/${code}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

async function addToCart(code) {
  const cookiesString = document.cookie;
  const cookiesArray = cookiesString.split(";");
  const cookies = {};
  cookiesArray.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookies[name] = value;
  });
  const token = cookies.token;
  const lsCartId = cookies.cartId;

  console.log("Token:", token);
  console.log("ID del Carrito:", lsCartId);
  let cart;
  if (!lsCartId) {
    const response = await fetch("/api/cart/newCart", {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    cart = await response.json();
    localStorage.setItem("cartId", cart.cart[0]._id);
  }
  const response = await postToCart(code, cart ? cart.cart[0]._id : lsCartId);

  if (response.status === 200) {
    alert("Producto agregado al carrito");
  }
}
const deleteProduct = async (code) => {
  try {
    const response = await fetch(`/api/products/${code}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
