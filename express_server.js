const {generateRandomString, checkEmail} = require("./helperFunctions")

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

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// CRUD actions start below
//------------------------------------------------

// Create login page
app.get("/login", (req, res) => {
  const templateVars = {user : null};
  res.render("login", templateVars);
});


// Store registration form data with error implementation
app.post("/register", (req, res) => {
  
  const id = `user${generateRandomString()}`;
  const email = req.body.email;
  const password = req.body.password;
  
  if (checkEmail(users, email)[0]) {
    res.status(400).send(`Invalid email. "${email}" is already is use.`);
    return;
  } 
  
  if (email && password) {
    const user = {id, email, password};
    users[id] = user;
    res.cookie("userid", id);
    res.redirect("/urls");
    return;
  }

  res.status(400).send(`Please enter a valid email`);
});

// Create registration form
app.get("/register", (req, res) => {
  const templateVars = {user : null};
  // if (req.cookies.userid) {
  //     templateVars.user = users[req.cookies.userid]
  // };
  res.render("register", templateVars);
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("userid")
  res.redirect(`/urls`); 
});

// Login 
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password
  if (checkEmail(users, email)[0] && checkEmail(users, email)[2] === password) {
    const id = (checkEmail(users, email)[3])
    res.cookie("userid", id);
    res.redirect(`/urls`);
    return;
  }
  res.status(403).send(`Email or password cannot be found`);
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
    user: users[req.cookies.userid]
  };
  res.render("urls_index", templateVars);
});

// Render "create a url" page
app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user: users[req.cookies.userid]
  };
  res.render("urls_new", templateVars);
});

// Render edit page as well as short url page e.g /urls/a45kg24!@ 
app.get("/urls/:shortURL", (req, res) => {
  const id = req.params.shortURL
  const templateVars = {
    shortURL: id, 
    longURL: urlDatabase[req.params.shortURL], 
    user: users[req.cookies.userid]
  };
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
