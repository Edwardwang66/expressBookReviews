const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {
  let users = require("./auth_users.js").users;
  let { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(200).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let books = require("./booksdb.js");
  res.status(200).json({ books: JSON.stringify(books, null, 4) });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let books = require("./booksdb.js");
  let isbn = req.params.isbn;
  if (books[isbn]) {
      res.status(200).json({ book: books[isbn] });
  } else {
      res.status(404).json({ message: "Book not found" });
  }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let books = require("./booksdb.js");
  let author = req.params.author.toLowerCase();
  let results = [];

  for (let key in books) {
      if (books[key].author.toLowerCase() === author) {
          results.push(books[key]);
      }
  }

  if (results.length > 0) {
      res.status(200).json({ books: results });
  } else {
      res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let books = require("./booksdb.js");
  let title = req.params.title.toLowerCase();
  let results = [];

  for (let key in books) {
      if (books[key].title.toLowerCase() === title) {
          results.push(books[key]);
      }
  }

  if (results.length > 0) {
      res.status(200).json({ books: results });
  } else {
      res.status(404).json({ message: "No books found with this title" });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let books = require("./booksdb.js");
  let isbn = req.params.isbn;

  if (books[isbn]) {
      res.status(200).json({ reviews: books[isbn].reviews });
  } else {
      res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
