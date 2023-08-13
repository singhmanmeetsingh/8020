// Import the Page model
const Page = require("../models/Page");

// Render the index page
exports.index = (req, res) => {
  // Render the "Index" view with id set to false
  res.render("./Index", { id: false });
};

// Render dynamic pages based on slug
exports.dyn = async (req, res) => {
  console.log("req", req.params);

  // Retrieve all pages
  let pages = await Page.find({}).then((page) => {
    return page;
  });

  console.log("sdsdsdsdsds");

  // Find a page with the provided slug
  Page.findOne({ slug: req.params.slug })
    .then((page) => {
      console.log("page found", page);

      // If page found, render the "Page" view with page data and all pages
      // Otherwise, redirect to the homepage
      page ? res.render("Page", { page, pages }) : res.redirect("/");
    })
    .catch((err) => res.redirect("/"));
};
