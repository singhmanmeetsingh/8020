const Pages = require('../models/Page');
const { validationResult} = require('express-validator');

exports.index = (req, res) => {
    if (req.session.isLoggedIn) {
      return res.redirect("/dashboard"); // Redirect to a dashboard page if the user is logged in
    } else {
      return res.redirect("/login");
    }
}

exports.addPage = (req, res, next) => {

  const validationErrors = validationResult(req);
  console.log("Validation", validationErrors)
  const page = new Pages({
    title: req.body.title,
    imgUrl: req.body.imgUrl,
    content: req.body.content,
  });
  page
    .save()
    .then((page) => {
      console.log("saved", page);
      return res.render("./Dashboard");
    })
    .catch((err) => {
      console.log("error", err);
      return res.render("./Dashboard");
    });
};




exports.deletePage = (req, res, next) => {
  console.log("SAdasdsads")
  Pages.deleteOne({ title: req.body.title })
      .then((page) => {
        console.log("page", page)
        res.redirect("/dashboard")         
      })
      .catch((err) => res.redirect("/dashboard"));

};