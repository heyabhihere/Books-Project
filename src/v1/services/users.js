
const bcrypt = require("bcrypt");
const generateOTP = require("../../utills/utilities/otp");
const users = require("../../models/user");
const sendEmail = require("../../utills/utilities/email");
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE } = require("../../../config/envExports");

//signup
const registerUser = async (data) => {

    if (!data.password || !data.email)
        throw new Error("Email and password are required.");

    const hashPassword = await bcrypt.hash(data.password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); //1 minut

    const user = await users.create({
        email: data.email,
        password: hashPassword,
        otp,
        otpExpiry,
        jti: uuidv4()
    });

    await sendEmail(data.email, otp);
    return { message: "OTP sent to email", userId: user._id };

};

// verify otp
const verifyOtp = async (email, inputOtp) => {
    const user = await users.findOne({ email });
    if (!user || user.otp !== inputOtp || user.otpExpiry < Date.now()) {
        throw new Error("Invalid or expired OTP");
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.emailVerified = true;
    await user.save();

    const token = jwt.sign(
        { userId: user._id, email: user.email, jti: user.jti },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
    );

    return { message: "Email verified successfully", token };
};

//login
const loginUser = async (email, password) => {
    const user = await users.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.emailVerified) {
        throw new Error("Email not verified");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id, email: user.email, jti: user.jti }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
    });

    return {
        message: "Login successful",
        token,
        user: {
            email: user.email,
            name: user.name,
            DOB: user.DOB,
            gender: user.gender,
        },
    };
};

const changePasswordService = async (email, password, newPassword) => {
    const user = await users.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Old password is not correct");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    return { message: "Password changed successfully" };
}

const userList = async (page = 1, limit = 10) => {
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    const userRecords = await users.find().skip(skip).limit(parsedLimit);
    const total = await users.countDocuments();
    return { users: userRecords, total };
}

const updateProfileService = async (userId, data) => {
    const user = await users.findByIdAndUpdate(userId, data, { new: true }).select('-password -otp -otpExpiry -jti');
    if (!user) throw new Error("User not found");
    return user;
}

module.exports = { registerUser, verifyOtp, loginUser, changePasswordService, userList, updateProfileService }