const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username) => {
  const users = require("./auth_users.js").users;
  // Check if the username exists in the users array
  return users.some(user => user.username === username);
}

// Check if the username and password match any user in the records
const authenticatedUser = (username, password) => {
  const users = require("./auth_users.js").users;
  // Find a user with the matching username and password
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}


//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign({ username: username }, 'access', { expiresIn: '1h' });
      req.session.authorization = {
          accessToken: accessToken
      };
      return res.status(200).json({ message: "User successfully logged in", accessToken });
  } else {
      return res.status(401).json({ message: "Invalid username or password" });
  }
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let books = require("./booksdb.js");
  let username = req.user.username; // Assuming the user is authenticated and the username is stored in req.user
  let isbn = req.params.isbn;
  let review = req.query.review;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
      return res.status(400).json({ message: "Review content is required" });
  }

  if (!books[isbn].reviews) {
      books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let books = require("./booksdb.js");
  let username = req.user.username; // Assuming the user is authenticated and the username is stored in req.user
  let isbn = req.params.isbn;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
  } else {
      return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
