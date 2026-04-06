const express = require('express')
const router = express.Router();
const { getBooks, getAllBooks, getBookDetails, addBook, updateBook, deleteBook, likeBook, getBookLikes } = require('../controller/books');
const { authenticator, optionalAuthenticator } = require('../../../middleware/authentication');

router.get("/books", authenticator, getBooks);
router.get("/all-books", optionalAuthenticator, getAllBooks);
router.get("/books/:id", authenticator, getBookDetails);
router.get("/books/:id/likes", authenticator, getBookLikes); // See who liked the book
router.post("/books", authenticator, addBook);
router.put("/books/:id", authenticator, updateBook);
router.put("/books/:id/like", authenticator, likeBook); // Toggle like
router.delete("/books/:id", authenticator, deleteBook);

module.exports = router;