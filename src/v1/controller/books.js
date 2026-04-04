const { bookSchema } = require("../../utills/validations/books");
const booksService = require("../services/books");

const getBooks = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await booksService.getBooks(page, limit);
        res.status(200).json({ list: result.books, total: result.total });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getBookDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await booksService.getBookDetails(id);
        res.status(200).json({ book: result.book });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const addBook = async (req, res) => {
    try {
        await bookSchema.validateAsync(req.body);
        const result = await booksService.addBook(req.body);
        res.status(200).json({ book: result.book, message: "Book added Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateBook = async (req, res) => {
    try {
        await bookSchema.validateAsync(req.body);
        const { id } = req.params;
        const result = await booksService.updateBook({ id, body: req.body });
        res.status(200).json({ book: result.book, message: "Book details updated Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await booksService.deleteBook(id);
        res.status(200).json({ book: result.book, message: "Book deleted Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getBooks, getBookDetails, addBook, updateBook, deleteBook }