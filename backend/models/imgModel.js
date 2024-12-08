let mongoose = require("mongoose");

// All properties will have required set to true by default
let image = mongoose.Schema({
  title: String,
  url: String,
  likes: Number,
  user: {
    // Referring to another model (https://github.com/rohan-paul/Awesome-JavaScript-Interviews/blob/master/MongoDB/referencing-another-schema-in-Mongoose-2.md)
    // [Foreign key]
    type: mongoose.Schema.ObjectId,
    ref: "Users",
  },
  categories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Categories",
    },
  ],
});

const ImageModel = mongoose.model("Images", image);

module.exports = ImageModel;
