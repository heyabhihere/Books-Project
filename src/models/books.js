const { default: mongoose } = require("mongoose");
const { GENRE_TYPES } = require("../constants/enums");

const books = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
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
        },
        likes: {
            type: Number,
            default: 0
        },
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]

    },
    { timestamps: true }
)

module.exports = mongoose.model("Books", books)