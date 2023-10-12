const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login"); //
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/products");
    });
  })(req, res, next);
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  return res.redirect("/products");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
