//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);




app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/login", function(req, res) {
  res.render("login");
});


app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log("Could not save user.")
    }
    // NOTE THAT THE "SECRETS" PAGE IS ONLY RENDERED FROM THE REGISTER
    // OR THE LOGIN PAGES; THIS CREATES THE LEVEL 1 AUTHENTICATION.
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;


  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
      res.render(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
        // HERE YOU WOULD LIKELY RES.RENDER AN ELSE STATEMENT AND "TRY AGAIN" PAGE.
      }
    }
  });
});










app.listen(3000, function() {
  console.log("Server started on port 3000");
});
