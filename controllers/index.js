const Page = require("../models/Page");

exports.index = (req, res) => {
    res.render("./Index", {id: false});
}

// this is example for dynamic routes
exports.dyn = (req, res) => {
    console.log("req", req.params)
    Page.findOne({ title: req.params.pageName })
      .then((page) => {
        console.log("page found", page);
        page ?  res.render("./Dynamicpage") : res.redirect("/")         
      })
      .catch((err) => res.redirect("/"));
}