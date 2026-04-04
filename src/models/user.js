const mongoose = require("mongoose");
const { GENDER_TYPES } = require("../constants/enums");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            default: null
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        gender: {
            type: Number,
            enum: Object.values(GENDER_TYPES),
            default: null
        },
        DOB: {
            type: Date,
            default: null
        },
        jti: {
            type: String
        },
        emailVerified: { type: Boolean, default: false },
        otp: { type: String },
        otpExpiry: { type: Date }

    },
    { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)