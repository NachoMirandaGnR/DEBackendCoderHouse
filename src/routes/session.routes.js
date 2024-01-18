import { Router } from "express";
import userModel from "../dao/mongo/models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import * as authControler from "../dao/mongo/controllers/userManager.js";
import { verifyToken, isAdmin } from "../middlewares/authJWT.js";
import jwt from "jsonwebtoken";
import roleModel from "../dao/mongo/models/role.models.js";
import * as dotenv from "dotenv";

dotenv.config();
const sessionRouter = Router();
//login
sessionRouter.post("/login", authControler.login);
//singUp
sessionRouter.post("/signup", authControler.signup);
//logout
sessionRouter.get("/logout", authControler.logout);
//forgotPassword
sessionRouter.post("/forgotPassword", authControler.forgotPassword);
// Iniciar sesion con GitHub API
sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:username"] }),
  async (req, res) => {}
);
//en caso de que falle el login con GitHub
sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.admin = true;
    res.redirect("/");
  }
);
sessionRouter.get("/users", async (req, res) => {
  const users = await userModel.find();
  res.json(users);
});
sessionRouter.get("/users/:token", async (req, res) => {
  try {
    const token = req.params.token || req.cookies.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    const id = decoded.id;
    const user = await userModel.findById(id);

    // Utilizar await para obtener el rol
    const roleObject = await roleModel.findById(user.roles);
    const role = roleObject.name;

    res.json({ user, role });
  } catch (error) {
    console.error("Error obteniendo información del usuario:", error);
    res.status(500).json({ error: "Error obteniendo información del usuario" });
  }
});

// Manejar el formulario de actualización de perfil
sessionRouter.post("/update", verifyToken, async (req, res) => {
  try {
    const token = req.params.token || req.cookies.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    const id = decoded.id;
    console.log(id);

    const user = await userModel.findById(id);
    // Procesar datos del formulario y actualizar información del usuario en MongoDB
    const { username, email, password, age } = req.body;
    console.log(req.body);

    // Actualizar datos del usuario en MongoDB solo si se proporcionan en la solicitud
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) updateFields.password = createHash(password);
    if (age) updateFields.age = age;

    await userModel.updateOne({ _id: user.id }, { $set: updateFields });

    // Puedes enviar una respuesta indicando que la actualización fue exitosa
    alert("Perfil actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar datos de usuario", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default sessionRouter;
