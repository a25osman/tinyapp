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

module.exports = generateRandomString;