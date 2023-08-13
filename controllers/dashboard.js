// Import required modules and models
const Page = require("../models/Page");
const { validationResult } = require("express-validator");
const filePath = "public/images/";

// Middleware to render the Dashboard if logged in, otherwise redirect to login
exports.index = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.render("Dashboard");
  } else {
    return res.redirect("/login");
  }
};

// Middleware to render the Add Page form if logged in, otherwise redirect to login
exports.getAddPage = (req, res) => {
  if (req.session.isLoggedIn) {
    const data = {};
    return res.render("Add", data);
  } else {
    return res.redirect("/login");
  }
};

// Middleware to handle adding a new page
exports.postAddPage = (req, res, next) => {
  // Handle validation errors
  let errors = validationResult(req);
  let data;
  if (!errors.isEmpty()) {
    data = { errors: errors.array() };
    return res.render("Add", data);
  } else if (!req.files) {
    errors = [{ msg: "Add an image" }];
    data = { errors: errors };
    return res.render("Add", data);
  } else {
    // Handle image upload and create a new page instance
    let image = req.files.image;
    let imagePath = filePath + image.name;
    image.mv(imagePath, function (err) {
      if (err) console.log(err);
    });
    
    const page = new Page({
      title: req.body.title,
      slug: req.body.slug,
      imgUrl: "images/" + image.name,
      content: req.body.content,
    });

    // Save the page and redirect to manage page
    page
      .save()
      .then(() => {
        return res.redirect("/dashboard/manage");
      })
      .catch((err) => {
        console.log("error", err);
        return res.render("./Dashboard");
      });
  }
};

// Middleware to render the Manage Pages page if logged in, otherwise redirect to login
exports.getManagePage = (req, res) => {
  if (req.session.isLoggedIn) {
    // Fetch and render all pages
    Page.find({}).then((pages) => {
      return res.render("Manage", { pages: pages });
    });
  } else {
    return res.redirect("/login");
  }
};

// Middleware to render the Edit Page form with existing page data
exports.getEditPage = (req, res, next) => {
  Page.findOne({ slug: req.params.slug })
    .then((page) => {
      let data = { errors: [], page: page };
      res.render("Edit", data);
    })
    .catch((err) => res.redirect("/dashboard"));
};

// Middleware to handle updating a page
exports.postEditPage = async (req, res, next) => {
  let errors = validationResult(req);

  // Find the existing page data
  let data = await Page.findOne({ slug: req.params.slug })
    .then((page) => {
      return page;
    })
    .catch((err) => res.redirect("/dashboard"));

  let page = data;

  if (!errors.isEmpty()) {
    return res.render("Edit", { page, errors: errors.array() });
  } else {
    let image;
    let imagePath;

    // Handle optional image upload
    if (req?.files?.image) {
      image = req.files.image;
      imagePath = filePath + image.name;
      image.mv(imagePath, function (err) {
        if (err) console.log(err);
      });
    }

    // Update the page and redirect to manage page
    Page.updateOne(
      { slug: req.params.slug },
      {
        $set: {
          title: req.body.title,
          slug: req.body.slug,
          content: req.body.content,
          imgUrl: req?.files?.image ? "images/" + image.name : page.image,
        },
      }
    )
      .then(() => {
        res.redirect("/dashboard/manage");
      })
      .catch((err) => res.redirect("/dashboard"));
  }
};

// Middleware to handle deleting a page
exports.deletePage = (req, res, next) => {
  Page.deleteOne({ slug: req.body.slug })
    .then(() => {
      res.redirect("/dashboard/manage");
    })
    .catch((err) => res.redirect("/dashboard"));
};

// Middleware to render the Home page with all pages
exports.getHome = (req, res, next) => {
  Page.find({}).then((pages) => {
    res.render("Home", { pages: pages });
  });
};
