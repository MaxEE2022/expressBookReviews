const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res
    .status(404)
    .json({
      message: "Unable to register please provide username and password",
    });
});

// Get the book list available in the shop
async function getBooks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 600);
  });
}
public_users.get("/", async function (req, res) {
  try {
    const obtainedBooks = await getBooks();
    res.status(200).send(obtainedBooks);
  } catch (error) {
    res.status(500).send(`error obtaining the books : ${error.message}`);
  }
});

// Get book details based on ISBN
async function getBookByIsbn(isbn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books[isbn]);
    }, 600);
  });
}
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByIsbn(isbn);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send(`error obtaining the books : ${error.message}`);
  }
});

// Get book details based on author
async function getBookByAuthor(author) {
  const foundBooks = Object.values(books).filter((item) =>
    item.author.toLowerCase().includes(author.toLowerCase())
  );
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(foundBooks);
    }, 600);
  });
}
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const books = await getBookByAuthor(author);
    if (books.length === 0) res.statis(204).send("no books found");
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send(`error obtaining the books : ${error.message}`);
  }
});

// Get all books based on title
async function getBookByTitle(title) {
  const foundBooks = Object.values(books).filter((item) =>
    item.title.toLowerCase().includes(title.toLowerCase())
  );
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(foundBooks);
    }, 600);
  });
}
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const books = await getBookByTitle(title);
    if (books.length === 0) res.statis(204).send("no books found");
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send(`error obtaining the books : ${error.message}`);
  }
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByIsbn(isbn);
    const reviews = book["reviews"];
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send(`error obtaining the books : ${error.message}`);
  }
});

module.exports.general = public_users;
