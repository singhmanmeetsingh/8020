const { validationResult} = require('express-validator');
const User = require('../models/User');

 
exports.getLogin = (req, res) => {
  console.log("session", req.session.isLoggedIn)
   if (req.session.isLoggedIn) {
    return res.redirect('/dashboard'); // Redirect to a dashboard page if the user is logged in
  } else {
    console.log("ddsfdsfd")
    return res.render('./Login')
  }

};


exports.postLogin = (req, res, next) => {
  console.log("Req login", req.body);

  const validationErrors = validationResult(req);
  console.log("error", validationErrors)


  const user = {
    email: req.body.email,
    passoword: req.body.passoword
  }

  User.findOne(user)
    .then((user) => {
      console.log("Found user:", user);
      req.session.email = user.email;
      req.session.passoword = user.passoword;
      req.session.isLoggedIn = true;
      res.render('./Dashboard')
    })
    .catch((err) =>{
      console.log("err", err)
      return res.redirect('/login')
    })
};


exports.logout = (req, res, next) => {
  req.session.destroy();
  return res.redirect('/')
}