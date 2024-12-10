const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const upload = require("../middlewares/file_storage");
const auth = require("../middlewares/auth");
const User = require("../models/userModel");
const Image = require("../models/imgModel");
const Category = require("../models/catModel");

/* Note: Following routes are prefixed with `/image/` */

router.get("/all", async (req, res) => {
  try {
    let { category } = req.body;
    let raw_images = await Image.find(
      {},
      { _id: 1, title: 1, url: 1, likes: 1, user: 1, categories: 1 }
    );
    if (category) {
      const cat = await Category.find({ name: category });
      if (!cat) {
        return res
          .status(400)
          .json({ error: `Category with name, ${category}, not found @o@` });
      }
    }

    let images = [];
    for (let i = 0; i < raw_images.length; i++) {
      const img_user = await User.findById(raw_images[i].user);
      if (!img_user) {
        console.log(
          `[Error] User with id, ${raw_images[i].user}, not found :)`
        );
        continue;
      }

      let cat_names = [];
      for (let j = 0; j < raw_images[i].categories.length; j++) {
        const cat = await Category.findById(raw_images[i].categories[j]);
        if (!cat) {
          console.log(
            `[Error] Category with id, ${raw_images[i].categories[j]}, not found :)`
          );
          continue;
        }
        cat_names.push(cat.name);
      }

      if (category && !cat_names.includes(category)) {
        continue;
      }

      img = {
        id: raw_images[i]._id.toHexString(),
        title: raw_images[i].title,
        url: raw_images[i].url,
        likes: raw_images[i].likes,
        user: img_user.username,
        categories: cat_names,
      };

      images.push(img);
    }

    res.json({ images: images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NOTE: The request's content-type will be "multipart/form-data", so we'll have to create the array manually. In this case, we split the input by comma.
router.post("/add", auth, upload.single("file"), async (req, res) => {
  try {
    let { title, categories } = req.body;
    categories = categories.split(",");
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
        return res.status(400).json({
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
      likes: 0,
    });

    await img.save();
    res.json({ text: "Image added successfully ^v^" });
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
