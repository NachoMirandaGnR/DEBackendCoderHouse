import passport from "passport";
import GitHubStrategy from "passport-github2";
import usersModel from "../models/users.model.js";

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.232cce54dae56c89",
        clientSecret: "8e37e52ff79dc600902b700ba65e85234ce07ba1",
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const email = profile.emails[0].value;

          const user = await usersModel.findOne({ email });

          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 18,
              email,
              password: "",
            };

            const result = await usersModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
