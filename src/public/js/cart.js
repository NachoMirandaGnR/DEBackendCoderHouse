async function addToCart(code) {
  try {
    const lsCartId = localStorage.getItem("cartId");
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

    if (response.ok) {
      alert("Producto agregado al carrito");
      // Actualizar la página
      location.reload();
    }
  } catch (error) {
    console.error("Error al agregar al carrito:", error.message);
  }
}

const deleteFromCart = async (code) => {
  const lsCartId = localStorage.getItem("cartId");
  const response = await deleteProduct(code, lsCartId);
  if (response.status === 200) {
    alert("Producto eliminado del carrito");
  }
};

const emptyCart = async () => {
  try {
    const lsCartId = localStorage.getItem("cartId");
    if (!lsCartId) {
      alert("El carrito ya está vacío");
      return;
    }

    const response = await fetch(`/api/cart/${lsCartId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Carrito vaciado");

      localStorage.removeItem("cartId");

      const newCartResponse = await fetch("/api/cart/newCart", {
        method: "POST",
        headers: { "Content-type": "application/json" },
      });
      const newCart = await newCartResponse.json();
      localStorage.setItem("cartId", newCart.cart[0]._id);

      location.reload();
    }
  } catch (error) {
    console.error("Error al vaciar el carrito:", error.message);
  }
};

// Función para obtener el carrito desde el servidor
async function getCart() {
  try {
    const lsCartId = localStorage.getItem("cartId");

    if (!lsCartId) {
      return null;
    }

    const response = await fetch(`/api/cart/${lsCartId}`);
    if (response.ok) {
      const cart = await response.json();
      return cart;
    } else {
      console.error("Error al obtener el carrito:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el carrito:", error.message);
    return null;
  }
}

// // Función para calcular el total del carrito
// async function calculateTotal() {
//   try {
//     const cart = await getCart();

//     if (!cart) {
//       // No se pudo obtener el carrito
//       return 0;
//     }

//     let total = 0;

//     cart.cartProducts.forEach((product) => {
//       total += product.price * product.quantity;
//     });

//     return total;
//   } catch (error) {
//     console.error("Error al calcular el total del carrito:", error.message);
//     return 0;
//   }
// }
// // Función de ayuda para multiplicar dos valores
// function multiply(a, b) {
//   return a * b;
// }
