const generateRandomString = require("./genRandString")

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect(`/urls`); 
});

// Login 
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect(`/urls`); 
});

// Create New Url
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const code = generateRandomString()
  urlDatabase[code] = req.body.longURL;
  res.redirect(`/urls/${code}`);         // Respond with 'Ok' (we will replace this)
});

// Delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.params.shortURL;
  delete urlDatabase[id];
  res.redirect(`/urls`);
});

// Edit a long url
app.post("/urls/:shortURL", (req, res) => {
  const shorturl = req.params.shortURL;
  urlDatabase[shorturl] = req.body.longURL;
  res.redirect(`/urls`);
});

// Render URL main page
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"] 
  };
  res.render("urls_index", templateVars);
});

// Render "create a url" page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Render edit page as well as short url page e.g /urls/a45kg24!@ 
app.get("/urls/:shortURL", (req, res) => {
  const id = req.params.shortURL
  const templateVars = { shortURL: id, longURL: urlDatabase[req.params.shortURL], id};
  res.render("urls_show", templateVars);
});

// redirect to actual web page
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});