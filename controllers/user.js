const { validationResult} = require('express-validator');
const User = require('../models/User');

 
exports.getLogin = (req, res) => {
   if (req.session.isLoggedIn) {
    return res.redirect('/dashboard'); // Redirect to a dashboard page if the user is logged in
  } else {
    return res.render('./Login')
  }

};

exports.postLogin = (req, res, next) => {
  let errors = validationResult(req);
  let data;
  if (!errors.isEmpty()) {
    data = { errors: errors.array() };
    res.render("Login", data)
  }

  console.log("login errors", )

  const user = {
    email: req.body.email,
    password: req.body.password
  }
  User.findOne(user)
    .then((user) => {
      console.log("Found user:", user);
      req.session.email = user.email;
      req.session.passoword = user.passoword;
      req.session.isLoggedIn = true;
      res.redirect("/dashboard");
    })
    .catch((err) => {
      console.log("err", err);
      errors = [
        {
          msg: "Invalid username por password ",
        },
      ];

      data = { errors: errors };
      return res.render("Login", data);
    });
};


exports.logout = (req, res, next) => {
  req.session.destroy();
  return res.redirect('/')
}