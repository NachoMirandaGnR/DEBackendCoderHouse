import userModel from "../models/user.models.js";
import { createHash, isValidPassword } from "../../../utils.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as cookie from "cookie";
import Role from "../models/role.models.js";
import CustomError from "../../../services/errors/customErrors.js";
import {
  enumErrors,
  generateUserErrorInfo,
} from "../../../services/errors/customErrors.js";
import { transporter } from "../../../config/mailing.config.js";
import cartModel from "../models/carts.models.js";
export const signup = async (req, res) => {
  const { username, email, password, age, roles } = req.body;
  const newUser = new userModel({
    username,
    email,
    password: createHash(password),
    age,
    roles,
  });
  const emailExist = await userModel.findOne({ email: email });
  const usernameExist = await userModel.findOne({ username: username });
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
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const userExist = await userModel
    .findOne({ username: username })
    .populate("roles");
  if (!userExist) {
    console.log("Usuario no existe");
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const matchPassword = isValidPassword(password, userExist.password);
  if (!matchPassword) {
    console.log("Contraseña incorrecta");
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  const token = jwt.sign({ id: userExist._id }, process.env.SECRET, {
    expiresIn: "24h", // 24 horas
  });

  // Buscar o crear un carrito para el usuario
  let cart = await cartModel.findOne({ user: userExist._id });

  if (!cart) {
    // Si no hay un carrito, crea uno nuevo
    cart = await cartModel.create({ products: [], user: userExist._id });
  }

  // Asignar el ID del carrito al usuario
  userExist.cartId = cart._id;
  await userExist.save();

  // Configurar las cookies para el token y el ID del carrito
  const tokenCookie = cookie.serialize("token", token, {
    maxAge: 86400, // Tiempo de expiración en segundos (aquí, 24 horas)
    path: "/", // La cookie estará disponible en todas las rutas del sitio
  });

  const cartIdCookie = cookie.serialize("cartId", cart._id, {
    maxAge: 86400, // Tiempo de expiración en segundos (aquí, 24 horas)
    path: "/", // La cookie estará disponible en todas las rutas del sitio
  });

  // Establecer ambas cookies en la respuesta
  res.setHeader("Set-Cookie", [tokenCookie, cartIdCookie]);

  console.log(token);

  // Enviar el ID del carrito como parte de la respuesta JSON
  res.json({ token, cartId: cart._id });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const userExist = await userModel.findOne({ email: email });
  if (!userExist) {
    CustomError.createError({
      name: "error al loguear",
      message: "usuario no existe",
      code: enumErrors.AUTHENTICATION_ERROR,
    });
  }
  const message = { message: "email enviado" };
  const token = jwt.sign({ id: userExist._id }, process.env.SECRET, {
    expiresIn: "1h",
  });
  const verificationLink = `http://localhost:8080/api/views/regeneratepass/${token}`;
  await transporter.sendMail({
    from: '"restablecer contraseña" <abadiajoaquin04@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "restablecer contraseña", // Subject line
    html: `
      <p>Para recuperar tu contraseña haz click en el siguiente link</p>
      <a href="${verificationLink}">Recuperar contraseña</a>
      `, // html body
  });
  res.json({ verificationLink });
};
export const logout = async (req, res) => {
  req.session.destroy();
  res.clearCookie("token", "cartId");
  res.redirect("/");
  localStorage.clear();
};
