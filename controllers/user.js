// Import necessary modules and model
const { validationResult } = require("express-validator");
const User = require("../models/User");

// Render the login page if not logged in, otherwise redirect to dashboard
exports.getLogin = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/dashboard");
  } else {
    return res.render("./Login");
  }
};

// Handle user login
exports.postLogin = (req, res, next) => {
  // Validate user input
  let errors = validationResult(req);
  let data;
  if (!errors.isEmpty()) {
    data = { errors: errors.array() };
    res.render("Login", data);
  }

  // Attempt to find a user with the provided email and password
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  User.findOne(user)
    .then((user) => {
      // User found, set session variables and redirect to dashboard
      req.session.email = user.email;
      req.session.password = user.password;
      req.session.isLoggedIn = true;
      res.redirect("/dashboard");
    })
    .catch((err) => {
      // User not found or error occurred, render login page with error
      errors = [
        {
          msg: "Invalid username or password ",
        },
      ];
      data = { errors: errors };
      return res.render("Login", data);
    });
};

// Handle user logout
exports.logout = (req, res, next) => {
  // Destroy session and redirect to homepage
  req.session.destroy();
  return res.redirect("/");
};
