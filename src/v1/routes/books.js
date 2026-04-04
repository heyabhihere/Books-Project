const express = require('express')
const router = express.Router();
const { getBooks, getBookDetails, addBook, updateBook, deleteBook } = require('../controller/books');
const { authenticator } = require('../../../middleware/authentication');

router.get("/books", authenticator, getBooks);
router.get("/books/:id", authenticator, getBookDetails);
router.post("/books", authenticator, addBook);
router.put("/books/:id", authenticator, updateBook);
router.delete("/books/:id", authenticator, deleteBook);

module.exports = router