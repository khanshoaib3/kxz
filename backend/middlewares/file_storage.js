// Ref(Multer example): https://medium.com/@aman003malhotra/using-multer-to-store-files-in-express-a-comprehensive-guide-d1acd25ef4d5
// http://expressjs.com/en/resources/middleware/multer.html
const multer = require("multer");
const User = require("../models/userModel");

// Converts text to slug i.e., "this is a title" to "this-is-a-title"
// https://stackoverflow.com/a/54837767/12026423
// unused 😔😔
function slugify(s) {
  return s.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "") //remove diacritics
          .toLowerCase()
          .replace(/\s+/g, '-') //spaces to dashes
          .replace(/&/g, '-and-') //ampersand to and
          .replace(/[^\w\-]+/g, '') //remove non-words
          .replace(/\-\-+/g, '-') //collapse multiple dashes
          .replace(/^-+/, '') //trim starting dash
          .replace(/-+$/, ''); //trim ending dash
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: async (req, file, cb) => {
    try {
      const user = await User.findById(req.user_id);

      if (!user) {
        cb(new Error("User not found o-O"));
        return;
      }

      let extension = file.originalname.substring(file.originalname.lastIndexOf("."));

      cb(null, `${user.username}-${Date.now()}${extension}`);
    } catch (err) {
      cb(new Error(err.message));
    }
  },
});
const upload = multer({ storage: storage });

module.exports = upload;
