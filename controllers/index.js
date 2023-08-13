const Page = require("../models/Page");

exports.index = (req, res) => {
  res.render("./Index", { id: false });
};

exports.dyn = async(req, res) => {
  console.log("req", req.params);
  let pages = await Page.find({}).then((page) => { return page});
  console.log("sdsdsdsds")
  Page.findOne({ slug: req.params.slug })
    .then((page) => {
      console.log("page found", page);
      page ? res.render("Page", { page , pages }) : res.redirect("/");
    })
    .catch((err) => res.redirect("/"));
};
