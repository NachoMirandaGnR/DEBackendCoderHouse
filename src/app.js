import express from "express";
import expressHandlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import bcrypt from "bcrypt";
import LocalStrategy from "passport-local";
import User from "./dao/models/User.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import authRoutes from "./routes/authRoutes.js";
import viewRouter from "./routes/web/views.router.js";
import cors from "cors";
import initializePassport from "./src/config/passport.config.js";
import MongoSingleton from "./MongoSingleton.js";
import compression from "express-compression";
import errorHandle from "./src/middlewares/errors.js";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;

// Conexión a la base de datos MongoDB
mongoose
  .connect(
    "mongodb+srv://ignaciomiranda1180:Nacho7931456$@cluster0.llqpd8m.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Conexión a MongoDB establecida correctamente");
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });

mongoose.set("strictQuery", false);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// Configuración de Passport
app.use(
  session({ secret: "tu_secreto", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: "Usuario no encontrado" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return done(null, false, { message: "Contraseña incorrecta" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//usar compresion
app.use(compression());

// Configuración de Handlebars
app.engine(
  "handlebars",
  expressHandlebars({
    defaultLayout: "main",
    extname: ".handlebars",
  })
);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.static("public"));

//manejo de errores
app.use(errorHandle);

// Rutas de productos
app.use("/api/products", productsRouter);

// Rutas de carritos
app.use("/api/carts", cartsRouter);

// Rutas de autenticación
app.use("/auth", authRoutes);

// Rutas de Views
app.use("/", viewRouter);

app.use(
  cors({
    origin: ["https://coderhouse.com"],
  })
);

app.get("/realtimeproducts", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await Product.find().limit(parseInt(limit) || undefined);

    res.render("realTimeProducts", { products });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al cargar los productos en tiempo real" });
  }
});

// Configuración de Socket.io
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

// Inicia el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
