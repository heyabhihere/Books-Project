const { default: mongoose } = require("mongoose");
const { GENRE_TYPES } = require("../constants/enums");

const books = mongoose.Schema(
    {
        bookName: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        genre: {
            type: Number,
            required: true,
            enum: Object.values(GENRE_TYPES)
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        }

    },
    { timestamps: true }
)

module.exports = mongoose.model("Books", books)