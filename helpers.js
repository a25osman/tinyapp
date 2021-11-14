const generateRandomString = function () {
  let str = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const len = characters.length;
  for (let i = 0; i < 6; i++ ) {
    let rand = Math.floor(Math.random() * len); //(inclusive of 0, but not 1)
    str += characters[rand]
  }
  return str;
}

const checkEmail = function (users, email){ //users is object with user objects
  let users_array = Object.values(users) //users_array is array with user objects
  let check = false;
  let name = undefined;
  let pass = undefined;
  let id = undefined;
  for (let obj of users_array) {
    if (obj["email"] == email) {
      check = true;
      name = obj["email"];
      pass = obj["password"]
      id = obj["id"];
    }
  }
  return [check, name, pass, id];
}

const myURL = function (users, id) {
  let obj = {};
  for (let key in users) {
    if (users[key].userID === id) {
      obj[key] = users[key];
    }
  }
  return obj;
}


module.exports = {generateRandomString, checkEmail, myURL};