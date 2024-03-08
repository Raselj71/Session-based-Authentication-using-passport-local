const express = require("express");
const signupValidation = require("../Validation/signupValidation");
const validator = require("../Validation/validator");
const signupController = require("../Controller/signupController");
const profileUpload = require("../Midleware/profileUpload");
const validuser = require("../Midleware/validuser");
const loginController = require("../Controller/route.controller");

const route = express.Router();

route.post(
  "/signup",
  profileUpload,
  validuser,
  signupValidation,
  validator,
  signupController
);

route.get("/", (req, res) => {
  res.send("welcome to homepage");
});

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
route.get("/dashbord", checkAuthenticated, (req, res) => {
  res.send("you are in dashbord");
});

module.exports = route;
