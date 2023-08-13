const Page = require("../models/Page");
const { validationResult } = require("express-validator");
const filePath = "public/images/";

exports.index = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.render("Dashboard");
  } else {
    return res.redirect("/login");
  }
};

exports.getAddPage = (req, res) => {
  if (req.session.isLoggedIn) {
    const data = {};
    return res.render("Add", data);
  } else {
    return res.redirect("/login");
  }
};

exports.postAddPage = (req, res, next) => {
  console.log("Add page post", { body: req.body, image: req.files });
  let errors = validationResult(req);
  let data;
  if (!errors.isEmpty()) {
    data = { errors: errors.array() };
    console.log("Errors", data);
    return res.render("Add", data);
    // check if quantities are entered for products
  } else if (!req.files) {
    // if no products are selected ask user to buy at least one product
    errors = [
      {
        msg: "Add an image",
      },
    ];
    data = { errors: errors };
    console.log("Errors", data);
    return res.render("Add", data);
  } else {
    // console.log("Validation", validationErrors);
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
    page
      .save()
      .then((page) => {
        return res.render("Manage", data);
      })
      .catch((err) => {
        console.log("error", err);
        return res.render("./Dashboard");
      });
  }
};

exports.getManagePage = (req, res) => {
  if (req.session.isLoggedIn) {
    Page.find({}).then((page) => {
      return res.render("Manage", { pages: page });
    });
  } else {
    return res.redirect("/login");
  }
};

exports.getEditPage = (req, res, next) => {
  // console.log("Inside edit page", req.params);

  Page.findOne({ slug: req.params.slug })
    .then((page) => {
      let data = { errors: [], page: page };
      // console.log("Page Found!", page);
      res.render("Edit", data);
    })
    .catch((err) => res.redirect("/dashboard"));
};

exports.postEditPage = async (req, res, next) => {
  let errors = validationResult(req);
  let data = await Page.findOne({ slug: req.params.slug })
    .then((page) => {
      console.log("Page Found!", page);
      return page;
    })
    .catch((err) => res.redirect("/dashboard"));

  let page = data;
  if (!errors.isEmpty()) {
    // res.locals = errors.array();
    // data = { page, errors: errors.array() };
    // console.log("Errors", data);
    return res.render("Edit", { page, errors: errors.array() });
  } else {
    // let image = req.files.image;
    // let imagePath = filePath + image.name;
    // image.mv(imagePath, function (err) {
    //   if (err) console.log(err);
    // });

    Page.updateOne(
      { slug: req.params.slug },
      {
        $set: {
          title: req.body.title,
          slug: req.params.slug,
          content: req.body.content,
        },
      }
    )
      .then((page) => {
        console.log("Page Found!", page);
        res.render("Manage");
      })
      .catch((err) => res.redirect("/dashboard"));
  }
};

exports.deletePage = (req, res, next) => {
  console.log("Inside delete page", req.body.slug);
  Page.deleteOne({ slug: req.body.slug })
    .then((page) => {
      console.log("Page deleted!", page);
      res.redirect("/dashboard/manage");
    })
    .catch((err) => res.redirect("/dashboard"));
};
