const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const auth = require("../middlewares/auth");

// Should definitely be changed as this is supposed to be private
// should also match the one in ./middlewares/auth.js
const JWT_KEY = "the_definition_of_insanity";

/* Note: Following routes are prefixed with `/auth` */
// Ref(Authentication with MERN Stack): https://namanrivaan.medium.com/authentication-with-mern-stack-9a4dbcd2290d

router.post("/signup", async (req, res) => {
  try {
    const { username, password, confirm_password, name } = req.body;
    console.log(req.body);
    if (!username || !password || !confirm_password || !name) {
      return res.status(400).json({ error: "Please enter all the fields -_-" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password should be atleast 6 characters :)" });
    }
    if (confirm_password !== password) {
      return res
        .status(400)
        .json({ error: "Both the passwords dont match -_-" });
    }
    const exits = await User.findOne({ username });
    if (exits) {
      return res.status(400).json({ error: "Username already taken ;)" });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    const user = new User({
      username,
      password: hashedPassword,
      name,
    });

    const savedUser = await user.save();
    res.json({ text: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Please enter all the fields -_-" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .send({ error: "User with this username does not exist" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ error: "Incorrect password :(" });
    }
    const token = jwt.sign({ id: user._id }, JWT_KEY);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Please enter the password -_-" });
    }

    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(400).send({ error: "Can't find the user!" });
    }

    const token = await User.deleteOne({ _id: req.user_id });
    res.json({ text: "User deleted successfully!" });
} catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout should be done at front-end

module.exports = router;
