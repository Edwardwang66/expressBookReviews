const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
//let books = require("./booksdb.js");

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
public_users.get('/', async function (req, res) {
  try {
    // Simulate async operation with Promise.resolve
    const bookList = await Promise.resolve(books);
    res.status(200).json({ books: JSON.stringify(bookList, null, 4) });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the list of books', error });
  }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);
    if (book) {
      res.status(200).json({ book });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the book details by ISBN', error });
  }
});


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author.toLowerCase();
    const bookList = await Promise.resolve(Object.values(books).filter(book => book.author.toLowerCase() === author));
    if (bookList.length > 0) {
      res.status(200).json({ books: bookList });
    } else {
      res.status(404).json({ message: 'No books found by this author' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the book details by author', error });
  }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title.toLowerCase();
    const bookList = await Promise.resolve(Object.values(books).filter(book => book.title.toLowerCase() === title));
    if (bookList.length > 0) {
      res.status(200).json({ books: bookList });
    } else {
      res.status(404).json({ message: 'No books found with this title' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the book details by title', error });
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