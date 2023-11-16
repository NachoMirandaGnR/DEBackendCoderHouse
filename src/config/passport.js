import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userModel from "../dao/mongo/models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";
import * as dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

//const localStrategy = local.Strategy;
// const initializePassport = () => {
//   passport.use(
//     "signup",
//     new localStrategy(
//       {
//         passReqToCallback: true,
//         usernameField: "username",
//       },
//       async (req, username, password, done) => {
//         const { email, age } = req.body;
//         try {
//           const user = await userModel.findOne({ username });
//           if (user) {
//             return done(null, false, { message: "user already registered" });
//           }
//           const newUser = {
//             username,
//             email,
//             password: createHash(password),
//             age,
//           };
//           console.log(newUser);
//           let result = await userModel.create(newUser);
//           return done(null, result);
//         } catch (error) {
//           throw done("error al obtener el usuario");
//         }
//       }
//     )
//   );
//   passport.use(
//     "login",
//     new localStrategy(
//       { usernameField: "username" },
//       async (username, password, done) => {
//         try {
//           const user = await userModel.findOne({ username });
//           console.log(user);
//           if (!user) {
//             return done(null, false, { message: "el usuario no existe" });
//           }
//           if (!isValidPassword(password, user.password)) {
//             return done(null, false, { message: "wrong password" });
//           } else {
//             return done(null, user);
//           }
//         } catch (error) {
//           console.log("error al obtener el usuario");
//         }
//       }
//     )
//   );
//   passport.serializeUser((user, done) => {
//     done(null, user._id);
//   });
//   passport.deserializeUser(async (id, done) => {
//     let user = await userModel.findById(id);
//     done(null, user);
//   });
// };

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({
            username: profile?.username[0]?.value,
          });
          if (!user) {
            const newUser = {
              username: profile.displayName,
              email: profile?.emails[0]?.value,
              password: crypto.randomBytes(20).toString("hex"),
              age: 99,
            };
            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(null, error);
    }
  });
};
export default initializePassport;
