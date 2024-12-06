const express = require("express")
const router = express.Router()

/* Note: Following routes are prefixed with `/auth` */


router.post("/signup", (req, res) => {
    console.log("yolo");

    res.send("<h1>Auth routes</h1>");
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



module.exports = router