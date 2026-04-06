
const bcrypt = require("bcrypt");
const generateOTP = require("../../utills/utilities/otp");
const users = require("../../models/user");
const sendEmail = require("../../utills/utilities/email");
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE } = require("../../../config/envExports");
const { OTP_TYPES } = require("../../constants/enums");

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

// verify otp — type: OTP_TYPES.SIGNUP (1) | OTP_TYPES.FORGOT_PASSWORD (2)
const verifyOtp = async (email, inputOtp, type = OTP_TYPES.SIGNUP) => {
    const user = await users.findOne({ email });
    if (!user || user.otp !== inputOtp || user.otpExpiry < Date.now()) {
        throw new Error("Invalid or expired OTP");
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;

    if (type === OTP_TYPES.SIGNUP) {
        user.emailVerified = true;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email, jti: user.jti },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRE }
        );
        return { message: "Email verified successfully", token };
    }

    if (type === OTP_TYPES.FORGOT_PASSWORD) {
        await user.save();

        // Short-lived reset token (10 mins) — not a login token
        const resetToken = jwt.sign(
            { userId: user._id, email: user.email, purpose: 'reset-password' },
            JWT_SECRET,
            { expiresIn: '10m' }
        );
        return { message: "OTP verified. Proceed to reset password.", resetToken };
    }

    throw new Error(`Invalid type. Must be ${OTP_TYPES.SIGNUP} (signup) or ${OTP_TYPES.FORGOT_PASSWORD} (forgot-password).`);
};

// resend otp
const resendOtpService = async (email) => {
    const user = await users.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minute
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    await sendEmail(email, otp);
    return { message: "OTP resent to email" };
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

// forgot password — sends OTP to email
const forgetPasswordService = async (email) => {
    const user = await users.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1 minute
    user.otp = otp;
    // user.otp = '123456';
    user.otpExpiry = otpExpiry;
    await user.save();
    await sendEmail(email, otp);
    return { message: "OTP sent to email" };
}

// reset password — uses short-lived resetToken from verify-otp (forgot-password flow)
const resetPasswordService = async (resetToken, newPassword) => {
    let decoded;
    try {
        decoded = jwt.verify(resetToken, JWT_SECRET);
    } catch (err) {
        throw new Error("Invalid or expired reset token");
    }
    if (decoded.purpose !== 'reset-password') {
        throw new Error("Invalid reset token");
    }
    const user = await users.findById(decoded.userId);
    if (!user) {
        throw new Error("User not found");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    return { message: "Password reset successfully" };
}

module.exports = {
    registerUser,
    verifyOtp,
    resendOtpService,
    loginUser,
    changePasswordService,
    userList,
    updateProfileService,
    forgetPasswordService,
    resetPasswordService,
}