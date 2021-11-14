const {generateRandomString, checkEmail, myURL} = require("./helpers")

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

const bcrypt = require('bcryptjs');

// initial database

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "user2RandomID"
  }
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
  const hashedPassword = bcrypt.hashSync(password, 10);

  
  if (checkEmail(users, email)[0]) {
    res.status(400).send(`Invalid email. "${email}" is already is use.`);
    return;
  } 
  
  if (email && hashedPassword) {
    const user = {id, email, password: hashedPassword};
    users[id] = user;
    // res.cookie("userid", id);
    req.session.userid = id;
    res.redirect("/urls");
    return;
  }

  res.status(400).send(`Please enter a valid email`);
});

// Create registration form
app.get("/register", (req, res) => {
  const templateVars = {user : null};
  res.render("register", templateVars);
});

// Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/urls`); 
});

// Login 
app.post("/login", (req, res) => {
  const email = req.body.email;
  const storedPassword = checkEmail(users, email)[2];

  if (checkEmail(users, email)[0] && bcrypt.compareSync( req.body.password, storedPassword)) {
    const id = (checkEmail(users, email)[3])
    // res.cookie("userid", id);
    req.session.userid = id;
    res.redirect(`/urls`);
    return;
  }
  res.status(403).send(`Email or password cannot be found`);
});

// Create New Url
app.post("/urls", (req, res) => {
  if (req.session.userid){
    const code = generateRandomString()
    urlDatabase[code] = {longURL: req.body.longURL, userID: req.session.userid}
    res.redirect(`/urls/${code}`);  
    return;  
  }
  res.redirect(`/urls`);
});

// Delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.status(404).send("Error: The url you have attempted to delete does not exist.\n");
    return;
  }
  if (req.session.userid === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect(`/urls`);
    return;
  }
  if (req.session.userid) {
    res.status(403).send("Error: You can only delete URLs which belong to your account.\n");
    return;
  }  
  res.status(403).send("Error: You do not have premission to delete this page. Please login first.\n");
});

// Edit a long url
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.status(404).send("Error: The url you have attempted to edit does not exist.\n");
    return;
  }
  if (req.session.userid === urlDatabase[shortURL].userID){
    urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session.userid};
    res.redirect(`/urls`);
    return;
  }
  if (req.session.userid) {
    res.status(403).send("Error: You can only edit URLs which belong to your account.\n");
    return;
  }  
  res.status(403).send("Error: You do not have premission to edit this URL. Please login first.\n");
});

// Render URL main page
app.get("/urls", (req, res) => {
  let templateVars = {urls: null, user: null};
  if (req.session.userid){
    templateVars = { 
      urls: myURL(urlDatabase, req.session.userid), 
      user: users[req.session.userid]
    };
  }
  res.render("urls_index", templateVars);
  // res.send("Please log in or create an account to view URLs")

});

// Render "create a url" page
app.get("/urls/new", (req, res) => {
  const templateVars = {user: null};
  if (req.session.userid){
    templateVars.user = users[req.session.userid]
    res.render("urls_new", templateVars);
    return;
  }
  res.redirect("/login")
});

// Render edit page as well as short url page e.g /urls/a45kg24!@ 
app.get("/urls/:shortURL", (req, res) => {
  const id = req.params.shortURL
  if (!urlDatabase[id]) {
    res.status(404).send("Error: The url page you have attempted to access does not exist.\n");
    return;
  }
  const templateVars = {
    shortURL: id, 
    longURL: urlDatabase[req.params.shortURL].longURL, 
    user: users[req.session.userid]
  };
  res.render("urls_show", templateVars);
});

// redirect to actual web page
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]){
    res.status(404).send("The short url you have attempted to access does not exist")
    return; //i can move this block render edit page above but questions asks for this block
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
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
