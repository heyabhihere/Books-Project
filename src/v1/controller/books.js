const { bookSchema } = require("../../utills/validations/books");
const booksService = require("../services/books");

const getBooks = async (req, res) => {
    try {
        const { page, limit, search, genre } = req.query;
        const userId = req.user._id;
        const result = await booksService.getBooks(userId, page, limit, search, genre);
        res.status(200).json({ list: result.books, total: result.total });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllBooks = async (req, res) => {

    try {
        const { page, limit, search, genre } = req.query;
        const userId = req.user?._id;
        const result = await booksService.getAllBooks(userId, page, limit, search, genre);
        res.status(200).json({ list: result.books, total: result.total });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getBookDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const result = await booksService.getBookDetails(id, userId);
        res.status(200).json({ book: result.book });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const addBook = async (req, res) => {
    try {
        await bookSchema.validateAsync(req.body);
        const userId = req.user._id;
        const result = await booksService.addBook(userId, req.body);
        res.status(200).json({ book: result.book, message: "Book added Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateBook = async (req, res) => {
    try {
        await bookSchema.validateAsync(req.body);
        const { id } = req.params;
        const userId = req.user._id;
        const result = await booksService.updateBook({ id, userId, body: req.body });
        res.status(200).json({ book: result.book, message: "Book details updated Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const result = await booksService.deleteBook(id, userId);
        res.status(200).json({ book: result.book, message: "Book deleted Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const likeBook = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const result = await booksService.likeBook(id, userId);
        res.status(200).json({ book: result.book, hasLiked: result.hasLiked, message: result.hasLiked ? "Book liked successfully" : "Book unliked successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getBookLikes = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const result = await booksService.getBookLikes(id, userId);
        res.status(200).json({ likesCount: result.likes, likedBy: result.likedBy });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getBooks, getAllBooks, getBookDetails, addBook, updateBook, deleteBook, likeBook, getBookLikes }