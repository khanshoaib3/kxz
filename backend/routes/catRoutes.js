const express = require("express");
const router = express.Router();
const Category = require("../models/catModel");
const auth = require("../middlewares/auth");
const { admin } = require("../middlewares/roles");

/* Note: Following routes are prefixed with `/category/` */

router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find({}, { _id: 0, name: 1 });
    let cat_names = [];
    categories.forEach((cat) => {
      cat_names.push(cat.name);
    });
    res.json({ categories: cat_names });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", auth, admin, async (req, res) => {
  try {
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Please enter all the fields -_-" });
    }

    name = name.toLowerCase().trim();

    const exists = await Category.findOne({ name: name });
    if (exists) {
      return res
        .status(400)
        .json({ error: `Category with name, ${name}, already exists =_=` });
    }

    let cat = new Category({ name: name });
    await cat.save();
    res.json({ text: "Category created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, admin, async (req, res) => {
  try {
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Please enter all the fields -_-" });
    }

    name = name.toLowerCase().trim();

    let exists = await Category.findOne({ name: name });
    if (!exists) {
      return res
        .status(400)
        .json({ error: `Category with name, ${name}, not found :-(` });
    }

    await Category.deleteOne({ _id: exists._id });
    res.json({ text: "Category deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
