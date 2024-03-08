const { validationResult } = require("express-validator");
const fs = require("fs");

const validator = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
  } else {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          next(err);
        }
      });
    }
    next(result.array);
  }
};
module.exports = validator;
