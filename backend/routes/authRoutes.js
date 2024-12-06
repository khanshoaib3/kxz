const express = require("express")
const router = express.Router()

/* Note: Following routes are prefixed with `/auth` */

router.get("/", (req, res) => {
    console.log("yolo");

    res.send("<h1>Auth routes</h1>");
});


module.exports = router