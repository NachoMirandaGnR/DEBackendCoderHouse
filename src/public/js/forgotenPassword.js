async function postForgotpassword(email) {
  const data = { email };
  console.log(data);
  const response = await fetch("/api/sessions/forgotpassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}

const forgotpasswordForm = document.getElementById("forgotpassword-form");

forgotpasswordForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  postForgotpassword(email).then((datos) => console.log(datos));
});
