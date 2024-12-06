const express = require("express");
const app = express();
const cors = require('cors')
let db = require("./db")

/********** App Settings **********/
const HOST = "localhost";
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(express.json()); // Parses req.body content (in json) to javascript object
app.use(cors());
/**********************************/



/*********** Routes ***********/
const authRoutes = require('./routes/authRoutes');
const catRoutes = require('./routes/catRoutes');
const imgRoutes = require('./routes/imgRoutes');


// Authentication Routes (extended)
app.use("/auth", authRoutes);

// Image Category Routes (extended)
app.use("/category", catRoutes);

// Image Routes (extended)
app.use("/image", imgRoutes);

// Home Routes
app.get("/", (req, res) => {
  res.send("<h1><i>Look at how they massacared my bow</i></h1>");
});
/*******************************/




app.listen(PORT, HOST, (err) => {
  if (!err) {
    console.log("Server started...");
    console.log(`Server adress: http://${HOST}:${PORT}`);
  } else {
    console.log(`Error Occured: ${err}`);
  }
});
