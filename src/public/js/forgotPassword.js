async function postForgot(username, password, newPassword) {
  const response = await fetch("/api/sessions/forgot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, newPassword }),
  });

  const result = await response.json();
  return result;
}

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const newPassword = document.getElementById("newpassword").value;

  if (password !== newPassword) {
    alert("las contraseñas no coinciden");
  } else {
    postForgot(username, password, newPassword).then((datos) =>
      alert("contraseña reiniciada").catch((err) => alert("algo paso"))
    );
  }
});
