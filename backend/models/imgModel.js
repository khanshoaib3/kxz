let mongoose = require("mongoose");

// All properties will have required set to true by default
let image = mongoose.Schema({
  title: String,
  likes: Number,
  user: {
    // Foreign key
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
