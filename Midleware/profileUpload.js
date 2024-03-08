const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/resource/");
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg and png file are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("profile");

const profileUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      next(err);
    }

    next();
  });
};

module.exports = profileUpload;
