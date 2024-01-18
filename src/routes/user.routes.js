import Usuario from "../dao/mongo/models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";
import express from "express";
const userRouter = express.Router();
import Role from "../dao/mongo/models/role.models.js";

import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import CustomError from "../services/errors/customErrors.js";
import {
  enumErrors,
  generateUserErrorInfo,
} from "../services/errors/customErrors.js";

// Ruta para mostrar todos los usuarios
userRouter.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.render("usuarios/index", { usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para mostrar un usuario por nombre
userRouter.get("/usuarios/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const usuario = await Usuario.findOne({ username });
    if (usuario) {
      res.render("usuarios/detalle", { usuario });
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para crear un nuevo usuario
userRouter.post("/usuarios", async (req, res) => {
  const { username, email, password, age, roles } = req.body;
  const newUser = new Usuario({
    username,
    email,
    password: createHash(password),
    age,
    roles,
  });
  const emailExist = await Usuario.findOne({ email: email });
  const usernameExist = await Usuario.findOne({ username: username });
  if (!username || !email || !password || !age) {
    CustomError.createError({
      name: "Error creando usuario",
      cause: generateUserErrorInfo({
        first_name,
        last_name,
        age,
        email,
      }),
      message: "Error trying to create a user",
      code: enumErrors.INVALID_TYPE_ERROR,
    });
  } else if (emailExist || usernameExist) {
    CustomError.createError({
      name: "Error creando usuario",
      message: "error duplicate key",
      code: enumErrors.DUPLICATE_KEY_ERROR,
    });
  }
  if (roles) {
    const foundRoles = await Role.find({ name: { $in: roles } });

    newUser.roles = foundRoles.map((role) => role._id);
  } else {
    const role = await Role.findOne({ name: "user" });
    newUser.roles = [role._id];
  }
  const savedUser = await newUser.save();
  console.log(savedUser);

  const token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
    expiresIn: 86400, // 24 hours
  });
  res.json({ token });
});

// Ruta para actualizar un usuario
userRouter.put("/usuarios/:id", async (req, res) => {
  const id = req.params.id;
  const { username, email, password, age, roles } = req.body;
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { username, email, password, age, roles },
      { new: true }
    );
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

// Ruta para eliminar un usuario
userRouter.delete("/usuarios/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const usuario = await Usuario.findByIdAndDelete(id);
    if (usuario) {
      res.json({ message: "Usuario eliminado exitosamente" });
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

// Exporta el router para ser utilizado en otros archivos
export default userRouter;
