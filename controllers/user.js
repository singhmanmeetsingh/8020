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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('ERROR in login form', { errors: errors.errors });
  }

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
      res.redirect('/dashboard')
    })
    .catch((err) =>{
      console.log("err", err)
      return res.render('Login', err)
    })
};


exports.logout = (req, res, next) => {
  req.session.destroy();
  return res.redirect('/')
}