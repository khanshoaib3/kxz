let mongoose = require("mongoose");

// All properties will have required set to true by default
let user = mongoose.Schema({
  username: {type: String, unique: true},
  name: String,
  password: String,
  joining: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("Users", user);

module.exports = UserModel;
