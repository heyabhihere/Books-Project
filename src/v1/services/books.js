const booksSchema = require('../../models/books');

const getBooks = async (userId, page, limit, search, genre) => {
    try {
        const query = { userId };

        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { bookName: regex },
                { author: regex }
            ];
        }
        if (genre !== undefined && genre !== null && genre !== '') {
            query.genre = Number(genre);
        }
        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = parseInt(limit, 10) || 10;

        let books = await booksSchema.find(query).skip((parsedPage - 1) * parsedLimit).limit(parsedLimit).lean();
        books = books.map(book => {
            book.isLiked = userId ? (book.likedBy || []).some(id => id.toString() === userId.toString()) : false;
            delete book.likedBy;
            return book;
        });

        const total = await booksSchema.countDocuments(query);
        return { books, total };
    } catch (error) {
        throw error;
    }
}

const getAllBooks = async (userId, page = 1, limit = 10, search, genre) => {
    try {
        const query = {};

        // Exclude the current user's books if userId is defined
        if (userId) {
            query.userId = { $ne: userId };
        }

        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { bookName: regex },
                { author: regex }
            ];
        }

        if (genre !== undefined && genre !== null && genre !== '') {
            query.genre = Number(genre);
        }

        const parsedPage = parseInt(page, 10) || 1;
        const parsedLimit = parseInt(limit, 10) || 10;

        let books = await booksSchema.find(query).skip((parsedPage - 1) * parsedLimit).limit(parsedLimit).lean();
        books = books.map(book => {
            book.isLiked = userId ? (book.likedBy || []).some(id => id.toString() === userId.toString()) : false;
            delete book.likedBy;
            return book;
        });

        const total = await booksSchema.countDocuments(query);
        return { books, total };
    } catch (error) {
        throw error;
    }
}


const getBookDetails = async (id, userId) => {
    try {
        let book = await booksSchema.findOne({ _id: id, userId }).lean();
        if (book) {
            book.isLiked = userId ? (book.likedBy || []).some(id => id.toString() === userId.toString()) : false;
            delete book.likedBy;
            return { book };
        } else {
            throw new Error("Book not found");
        }
    } catch (error) {
        throw error;
    }
}

const addBook = async (userId, body) => {
    try {
        const exist = await booksSchema.findOne({ bookName: body.bookName, userId });
        if (exist) {
            throw new Error("Book already exists");
        }
        const book = await booksSchema.create({ ...body, userId });
        return { book };
    } catch (error) {
        throw error;
    }
}

const updateBook = async ({ id, userId, body }) => {
    try {
        const exist = await booksSchema.findOne({ _id: id, userId });
        if (!exist) {
            throw new Error("Book not found");
        }
        const book = await booksSchema.findByIdAndUpdate(id, body, { new: true });
        return { book };
    } catch (error) {
        throw error;
    }
}

const deleteBook = async (id, userId) => {
    try {
        const exist = await booksSchema.findOne({ _id: id, userId });
        if (!exist) {
            throw new Error("Book not found");
        }
        const book = await booksSchema.findByIdAndDelete(id);
        return { book };
    } catch (error) {
        throw error;
    }
}



const likeBook = async (id, userId) => {
    try {
        const book = await booksSchema.findById(id);
        if (!book) {
            throw new Error("Book not found");
        }

        const hasLiked = book.likedBy.includes(userId);
        if (hasLiked) {
            // Unlike it
            book.likedBy = book.likedBy.filter(uid => uid.toString() !== userId.toString());
            book.likes = book.likes - 1;
        } else {
            // Like it
            book.likedBy.push(userId);
            book.likes = book.likes + 1;
        }
        await book.save();
        return { book, hasLiked: !hasLiked }; // Return the new like status
    } catch (error) {
        throw error;
    }
}

const getBookLikes = async (id, userId) => {
    try {
        const book = await booksSchema.findOne({ _id: id, userId })
            .select('likedBy likes')
            .populate('likedBy', 'name email'); // only load name and email

        if (!book) {
            throw new Error("Book not found or you don't have permission to view it");
        }
        return book;
    } catch (error) {
        throw error;
    }
}

module.exports = { getBooks, getAllBooks, getBookDetails, addBook, updateBook, deleteBook, likeBook, getBookLikes }
