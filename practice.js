const bcrypt = require('bcryptjs');
const password = "purple-monkey-dinosaur"; // found in the req.params object
const hashedPassword = bcrypt.hashSync(password, 10);

console.log(bcrypt.compareSync("purple-monkey-dinosaur", hashedPassword)); // returns true
console.log(bcrypt.compareSync("pink-donkey-minotaur", hashedPassword)); // returns false

console.log(bcrypt.hashSync("purple-monkey-dinosaur"), hashedPassword)