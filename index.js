const express = require("express");


const app = express();
const port = 3000;

//Static Files
app.use(express.static("public"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/styles", express.static(__dirname + "public/styles"));
app.use("/styles/site.css", express.static(__dirname + "public/styles/site.css"));

//Sets Express Layouts and overrides default directory


//HTML Routes
app.set("view engine", "ejs");
app.engine(".html", require("ejs").__express);
app.set("views", "./views");

app.get("", (req, res) => {
  res.render("index.html");
});

app.get("/grooming", (req, res) => {
  res.render("grooming.html");
});

app.get("/boarding", (req, res) => {
  res.render("boarding.html");
});

app.get("/registration", (req, res) => {
  res.render("registration.html");
});

app.get("/training", (req, res) => {
  res.render("training.html");
});

//Listen on Port 3000

app.listen(port, () => {
  console.log("Application started and listening on port" + port);
});