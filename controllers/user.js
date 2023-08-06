const validator = require('express-validator');
const User = require('../models/User');

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};


/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  console.log("Req signup", req.body);

  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    console.log("valisdsadsadsa", validationErrors);
    return res.redirect("/signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  console.log("user", user);

  
  user.save()
    .then((saved) => {
        console.log("saved", saved)
        // 
    })
    .catch((err)=>{
        console.log("error", err)
        //add error
    })
};