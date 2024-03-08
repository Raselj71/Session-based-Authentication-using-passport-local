const express = require("express");
const app = express();
require("./config/passport");
const route = require("./Route/user.route");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(flash());

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 1000,
      sameSite: "strict",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(route);

const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
};

// login : get
app.get("/login", checkLoggedIn, (req, res) => {
  const messages = req.flash("error");
  return res.status(200).json({ redirectTo: "/dashbord" });
});

// login : post
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.status(401).send("Unauthorized"); // Or any other appropriate status code
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Authentication successful
      return res.status(200).json({ redirectTo: "/dashbord" }); // Or any other appropriate status code
    });
  })(req, res, next);
});
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("Unauthorized");
};

// profile protected route
app.get("/profile", checkAuthenticated, (req, res) => {
  res.send("profile page");
});

// logout route
app.get("/logout", (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use((req, res, next) => {
  next("Requested url was not found!");
});

app.use((err, req, res, next) => {
  if (res.headerSent) {
    next("There was a problem!");
  } else {
    if (err.message) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send(err);
    }
  }
});

module.exports = app;
