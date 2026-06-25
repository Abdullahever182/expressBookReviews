const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Username and password must be provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Unable to register user. Username and password are required."
        });
    }

    // Username already exists
    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists!"
        });
    }

    // Add the new user
    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(
        JSON.stringify(books, null, 4)
    );
});

// Task 10: Get all books using async-await and Axios
async function getAllBooksUsingAxios() {
    const response = await axios.get("http://127.0.0.1:5000/");
    return response.data;
}

// Route for testing Task 10
public_users.get("/async/books", async function (req, res) {
    try {
        const bookList = await getAllBooksUsingAxios();
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve books using Axios",
            error: error.message
        });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    return res.status(200).send(
        JSON.stringify(books[isbn], null, 4)
    );
});

async function getBookByISBNUsingAxios(isbn) {
    const response = await axios.get(
        `http://127.0.0.1:5000/isbn/${isbn}`
    );

    return response.data;
}

public_users.get("/async/isbn/:isbn", async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await getBookByISBNUsingAxios(isbn);

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve book by ISBN using Axios",
            error: error.message
        });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = {};

    Object.keys(books).forEach(function (isbn) {
        if (books[isbn].author === author) {
            matchingBooks[isbn] = books[isbn];
        }
    });

    return res.status(200).send(
        JSON.stringify(matchingBooks, null, 4)
    );
});

async function getBooksByAuthorUsingAxios(author) {
    const response = await axios.get(
        `http://127.0.0.1:5000/author/${encodeURIComponent(author)}`
    );

    return response.data;
}

public_users.get("/async/author/:author", async function (req, res) {
    try {
        const author = req.params.author;
        const booksByAuthor =
            await getBooksByAuthorUsingAxios(author);

        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve books by author using Axios",
            error: error.message
        });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = {};

    Object.keys(books).forEach(function (isbn) {
        if (books[isbn].title === title) {
            matchingBooks[isbn] = books[isbn];
        }
    });

    return res.status(200).send(
        JSON.stringify(matchingBooks, null, 4)
    );
});

async function getBooksByTitleUsingAxios(title) {
    const response = await axios.get(
        `http://127.0.0.1:5000/title/${encodeURIComponent(title)}`
    );

    return response.data;
}

public_users.get("/async/title/:title", async function (req, res) {
    try {
        const title = req.params.title;
        const booksByTitle =
            await getBooksByTitleUsingAxios(title);

        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve books by title using Axios",
            error: error.message
        });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    return res.status(200).send(
        JSON.stringify(books[isbn].reviews, null, 4)
    );
});

module.exports.general = public_users;
