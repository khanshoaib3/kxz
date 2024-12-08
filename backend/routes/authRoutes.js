// Ref(Authentication with MERN Stack): https://namanrivaan.medium.com/authentication-with-mern-stack-9a4dbcd2290d

const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const auth = require("../middlewares/auth");

// Should definitely be changed as this is supposed to be private
// should also match the one in ./middlewares/auth.js
const JWT_KEY = "the_definition_of_insanity";

/* Note: Following routes are prefixed with `/auth/` */

router.get("/info", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(400).send({ error: "Can't find the user!" });
    }

    res.json({ username: user.username, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password, confirm_password, name } = req.body;
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
      role: "user",
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

router.post("/is-token-valid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      // No token found
      return res.json(false);
    }

    const verified = jwt.verify(token, JWT_KEY);
    if (!verified) {
      // Invalid token (verification failed by jwt)
      return res.json(false);
    }

    const user = await User.findById(verified.id);
    if (!user) {
      // Invalid token (user not found)
      return res.json(false);
    }

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/is-member", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(400).send({ error: "Can't find the user!" });
    }

    if (user.role === "member") return res.json(true);

    res.json(false);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/is-admin", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(400).send({ error: "Can't find the user!" });
    }

    if (user.role === "admin") return res.json(true);

    res.json(false);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/is-admin-or-member", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(400).send({ error: "Can't find the user!" });
    }

    if (user.role === "member") return res.json(true);
    if (user.role === "admin") return res.json(true);

    res.json(false);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout should be done at front-end

module.exports = router;
