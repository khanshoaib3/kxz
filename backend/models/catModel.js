let mongoose = require("mongoose");

// All properties will have required set to true by default
let Category = mongoose.Schema({
  name: { type: String, unique: true, lowercase: true, trim: true },
});

const CategoryModel = mongoose.model("Categories", Category);

module.exports = CategoryModel;
