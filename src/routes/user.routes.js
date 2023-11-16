import { Router } from "express";
import __dirname from "../utils.js";

let usersRouter = Router();

usersRouter.get("/login", async (req, res) => {
  res.render("login", {
    title: "Iniciar Sesion",
  });
});
usersRouter.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Crea tu cuenta",
  });
});
usersRouter.get("/forgotpassword", (req, res) => {
  res.render("forgotPassword", {
    title: "Recupera tu contraseña",
  });
});

export default usersRouter;
