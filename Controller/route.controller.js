const bcrypt = require("bcrypt");
const userinfoModel = require("../Model/userinfoModel");

require("dotenv").config();

const loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userinfoModel.findOne({ username: username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "email is not found",
      });
    }
    const matchpassword = await bcrypt.compare(password, user.password);
    if (!matchpassword) {
      return res.status(400).json({
        success: false,
        message: "incorrect password",
      });
    }

    return res.status(200).send({
      success: true,
      message: "user in successfully login",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = loginController;
