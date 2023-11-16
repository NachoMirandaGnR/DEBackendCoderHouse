import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (savedPassword, password) => {
  console.log("Saved password: " + savedPassword, "Password: " + password);
  return bcrypt.compareSync(savedPassword, password);
};

const PRIVATE_KEY = "privateKey";
export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "token not found" });
  }
  const token = authHeader.split(":")[1];
  jwt.verify(token, PRIVATE_KEY, (err, user) => {
    if (err) {
      res.status(403).json({ error: "roken invalido" + err.message });
    }
    req.user = user;
    next();
  });
};
export default __dirname;
