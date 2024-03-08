const userModel = require("../Model/userinfoModel");
const fs = require("fs");
const validuser = async (req, res, next) => {
  const { username } = req.body;
  try {
    const result = await userModel.findOne({ username });
    if (result) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          next(err);
        }
      });

      return res.status(301).json({ message: "user already exist" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validuser;
