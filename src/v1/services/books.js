const booksSchema = require('../../models/books');

const getBooks = async (page, limit) => {
    try {
        const books = await booksSchema.find().skip((page - 1) * limit).limit(limit);
        const total = await booksSchema.countDocuments();
        return { books, total };
    } catch (error) {
        throw error;
    }
}

const getBookDetails = async (id) => {
    try {
        const book = await booksSchema.findById({ _id: id });
        if (book) {
            return { book };
        }
        else {
            throw new Error("Book not found");
        }
    } catch (error) {
        throw error;
    }
}

const addBook = async (body) => {
    try {
        const exist = await booksSchema.findOne({ bookName: body.bookName })
        if (exist) {
            throw new Error("Book already exists");
        }
        const book = await booksSchema.create(body);
        return { book };
    } catch (error) {
        throw error;
    }
}

const updateBook = async ({ id, body }) => {
    try {
        const exist = await booksSchema.findById({ _id: id })
        if (!exist) {
            throw new Error("Book not found");
        }
        const book = await booksSchema.findByIdAndUpdate({ _id: id }, body, { new: true });
        return { book };
    } catch (error) {
        throw error;
    }
}

const deleteBook = async (id) => {
    try {
        const exist = await booksSchema.findById({ _id: id })
        if (!exist) {
            throw new Error("Book not found");
        }
        const book = await booksSchema.findByIdAndDelete({ _id: id });
        return { book };
    } catch (error) {
        throw error;
    }
}

module.exports = { getBooks, getBookDetails, addBook, updateBook, deleteBook }
