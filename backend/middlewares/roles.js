const User = require("../models/userModel")

// Use this middleware in any route that requires a user
const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(400).send({ error: "Can't find the user!" });
    }

    if (user.role !== "admin")
      return res
        .status(401)
        .json({ error: "Does not have admin privilage @-@" });

    // Don't remove!!
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const member = async (req, res, next) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(400).send({ error: "Can't find the user!" });
    }

    if (user.role !== "member")
      return res
        .status(401)
        .json({ error: "Does not have member privilage @-@" });

    // Don't remove!!
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const adminOrMember = async (req, res, next) => {
  try {
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(400).send({ error: "Can't find the user!" });
    }

    if (user.role !== "member" && user.role !== "admin")
      return res
        .status(401)
        .json({ error: "Does not have member or admin privilage @-@" });

    // Don't remove!!
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { admin, member, adminOrMember };
