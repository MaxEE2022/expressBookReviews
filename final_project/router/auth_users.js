const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
async function updateBookReview(isbn, username, review) {
  if (!books[isbn]) {
    throw new Error(`Book not found with ISBN: ${isbn}`);
  }

  books[isbn].reviews[username] = review;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books[isbn]);
    }, 600);
  });
}
regd_users.put("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  try {
    const updatedBook = await updateBookReview(isbn, username, review);
    res.status(201).send(updatedBook);
  } catch (error) {
    res.status(500).send(`error: ${error.message}`);
  }
});

// Delete a book review
async function deleteBookReview(isbn, username) {
  if (!books[isbn]) {
    throw new Error(`Book not found with ISBN: ${isbn}`);
  }
  if (!books[isbn].reviews[username]) {
    throw new Error(`review not found under username: ${username}`);
  }
  delete books[isbn].reviews[username];
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books[isbn]);
    }, 600);
  });
}
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  try {
    const updatedBook = await deleteBookReview(isbn, username);
    res.status(200).send(updatedBook);
  } catch (error) {
    res.status(500).send(`error: ${error.message}`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
