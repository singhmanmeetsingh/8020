const { check } = require("express-validator");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env" });

// express configration
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
// using fileUpload
app.use(fileUpload());
app.set("port", process.env.PORT || 5500);
// SESSION START
app.use(
  session({
    key: "user_sid",
    secret: "qwerty@1234",
    resave: false,
    saveUninitialized: false,
    // cookie:{
    //   expires:500000,
    // },
  })
);

// SESSION END

// // Middleware to parse form datas
// app.use(bodyParser.urlencoded({ extended: false }));

// path for all the css imports
app.use(express.static(__dirname + "/public"));

// set the view engine to ejs
app.set("view engine", "ejs");

console.log("URI", process.env.MONGODB_URI);
/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "%s MongoDB connection error. Please make sure MongoDB is running."
  );
  process.exit();
});

// controllers
const indexController = require("./controllers");
const userController = require("./controllers/user");
const dashboardController = require("./controllers/dashboard");

//routes
app.get("/", dashboardController.getHome);

app.get("/login", userController.getLogin);

app.post(
  "/login",
  [
    check("email", "Your email is not valid").not().isEmpty(),
    check("password").not().isEmpty(),
  ],
  userController.postLogin
);

app.get("/logout", userController.logout);

app.get("/dashboard", dashboardController.index);

app.get(
  "/dashboard/add",dashboardController.getAddPage
);

app.post(
  "/dashboard/add",
  [
    check("title", "Enter a valid title").not().isEmpty(),
    check("slug", "Enter a valid slug").not().isEmpty(),
    check("content", "Content cannot be empty").not().isEmpty(),
  ],
  dashboardController.postAddPage
);

app.get("/dashboard/manage", dashboardController.getManagePage);

app.get("/dashboard/edit/:slug", dashboardController.getEditPage);

app.post(
  "/dashboard/edit/:slug",
  [
    check("title", "Enter a valid title").not().isEmpty(),
    check("slug", "Enter a valid slug").not().isEmpty(),
    check("content", "Content cannot be empty").not().isEmpty(),
  ],
  dashboardController.postEditPage
);

app.post("/dashboard/delete/", dashboardController.deletePage);

app.get("/:slug", indexController.dyn);

app.listen(app.get("port"), () => {
  console.log(
    `App is running on http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`
  );
  console.log("Press CTRL-C to stop");
});

module.exports = app;
