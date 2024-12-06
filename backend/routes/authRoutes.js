const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");

const User = require("../models/userModel");

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
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/signin", (req, res) => {
  console.log("yolo");

  res.send("<h1>Auth routes</h1>");
});

router.get("/logout", (req, res) => {
  console.log("yolo");

  res.send("<h1>Auth routes</h1>");
});

router.delete("/delete", (req, res) => {
  console.log("yolo");

  res.send("<h1>Auth routes</h1>");
});

module.exports = router;
