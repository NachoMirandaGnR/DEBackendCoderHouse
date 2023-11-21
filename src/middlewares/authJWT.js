import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import userModel from "../dao/mongo/models/user.models.js";
import roleModel from "../dao/mongo/models/role.models.js";
import * as cookie from "cookie";
dotenv.config();
export const verifyToken = async (req, res, next) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;
    console.log(token);
    if (!token) return res.status(403).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.id;
    const user = await userModel.findById(req.userId, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export const isAdmin = async (req, res, next) => {
  const user = await userModel.findById(req.userId);
  //console.log(user);
  const role = await roleModel.find({ _id: { $in: user.roles } });
  //console.log(role);
  for (let i = 0; i < role.length; i++) {
    if (role[i].name === "admin") {
      next();
      return;
    }
  }
  return res.status(403).json({ message: "Require Admin Role!" });
};
export const isPremium = async (req, res, next) => {
  const user = await userModel.findById(req.userId);
  //console.log(user);
  const role = await roleModel.find({ _id: { $in: user.roles } });
  //console.log(role);
  for (let i = 0; i < role.length; i++) {
    if (role[i].name === "premium") {
      next();
      return;
    }
  }
  return res.status(403).json({ message: "Require Premium Role!" });
};
