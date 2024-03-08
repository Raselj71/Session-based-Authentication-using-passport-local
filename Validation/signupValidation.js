const { check } = require("express-validator");

const signupValidation = [
  check("firstName").trim().notEmpty().withMessage("Enter first Name"),
  check("lastName").trim().notEmpty().withMessage("Enter Last Name"),
  check("username").isEmail().withMessage("Enter Valid Email"),
  check("password").isLength({ min: 3 }).withMessage("Password too short"),
];

module.exports = signupValidation;
