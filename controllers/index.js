const Page = require("../models/Page");

exports.index = (req, res) => {
  res.render("./Index", { id: false });
};

exports.dyn = (req, res) => {
  console.log("req", req.params);
  Page.findOne({ slug: req.params.slug })
    .then((page) => {
      console.log("page found", page);
      page ? res.render("Page", { page }) : res.redirect("/");
    })
    .catch((err) => res.redirect("/"));
};
