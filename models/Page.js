
const mongoose = require("mongoose");


const PagesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true
    },
    imgUrl: {
        type:String
    },
    content: {
        type:String
    }
  },
  { timestamps: true }
);


const Pages = new mongoose.model("Pages", PagesSchema);

module.exports = Pages;