const { assert } = require('chai');

const { checkEmail } = require('../helpers.js');

const testUsers = {
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
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = checkEmail(testUsers, "user@example.com")
    const expectedUserID = "userRandomID";
    assert.equal(user[3], expectedUserID);
  });

  it('should return undefined for invalid email', function() {
    const user = checkEmail(testUsers, "cat@example.com")
    const expectedUserID = undefined;
    assert.equal(user[3], expectedUserID);
  });
});