import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import Role from "./dao/mongo/models/role.models.js";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (savedPassword, password) => {
  console.log("Saved password: " + savedPassword, "Password: " + password);
  return bcrypt.compareSync(savedPassword, password);
};

export const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count > 0) return;
    const values = await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "premium" }).save(),
      new Role({ name: "admin" }).save(),
    ]);
    console.log(values);
  } catch (error) {
    console.error(error);
  }
};
export default __dirname;
