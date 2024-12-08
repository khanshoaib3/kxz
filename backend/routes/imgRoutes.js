const express = require("express");
const router = express.Router();
const upload = require("../middlewares/file_storage");
const auth = require("../middlewares/auth");
const User = require("../models/userModel");
const Image = require("../models/imgModel");
const Category = require("../models/catModel");

/* Note: Following routes are prefixed with `/image/` */

router.get("/all", (req, res) => {
  try {
    console.log("thala");

    res.send("<h1>Img routes</h1>");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NOTE: The request's content-type will be "multipart/form-data", so we'll have to create the array manually. In this case, we split the input by comma. 
router.post("/add", auth, upload.single("file"), async (req, res) => {
  try {
    let { title, categories } = req.body;
    categories = categories.split(",")
    let file = req.file;

    if (!title || !categories || categories.length < 0) {
      return res
        .status(400)
        .json({ error: "Enter all fields and at least one category ^-^" });
    }

    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(400).send({ error: "Can't find the user!" });
    }

    let category_ids = [];
    for (let i = 0; i < categories.length; i++) {
      const cat = await Category.findOne({ name: categories[i].trim() });
      if (!cat) {
        return res
          .status(400)
          .json({
            error: `Category with name, ${categories[i]}, not found =_=`,
          });
      }

      category_ids.push(cat._id);
    }

    let img = new Image({
      title,
      url: file.path,
      user: user._id,
      categories: category_ids,
      likes: 0
    });

    await img.save();
    res.json({text: "Image added successfully ^v^"})
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/edit", (req, res) => {
  try {
    console.log("thala");

    res.send("<h1>Img routes</h1>");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", (req, res) => {
  try {
    console.log("thala");

    res.send("<h1>Img routes</h1>");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
