const { loginValidation, changePasswordValidation, userRegister, updateProfileValidation } = require("../../utills/validations/users");
const Users = require('../../models/user');
const { OTP_TYPES } = require("../../constants/enums");
const {
    registerUser,
    verifyOtp: verifyOtpService,
    resendOtpService,
    loginUser,
    changePasswordService,
    userList,
    updateProfileService,
    forgetPasswordService,
    resetPasswordService,
} = require("../services/users");

//signup
const register = async (req, res) => {
    try {
        await userRegister.validateAsync(req.body);
        const { email } = req.body;
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exist" });
        }
        await registerUser(req.body);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// verify-otp — body: { email, otp, type: 1 (signup) | 2 (forgot-password) }
const verifyOtp = async (req, res) => {
    const { email, otp, type } = req.body;
    try {
        const result = await verifyOtpService(email, otp, Number(type));
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// resend-otp — body: { email }
const resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await resendOtpService(email);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//login
const login = async (req, res) => {
    try {
        await loginValidation.validateAsync(req.body);
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

const changePassword = async (req, res) => {
    try {
        await changePasswordValidation.validateAsync(req.body)
        const { email } = req.user;
        const { password, newPassword } = req.body;
        const result = await changePasswordService(email, password, newPassword);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const getAllUserList = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await userList(page, limit);
        res.status(200).json({ list: result.users, total: result.total });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        await updateProfileValidation.validateAsync(req.body);
        const userId = req.user._id;
        const result = await updateProfileService(userId, req.body);
        res.status(200).json({ message: "Profile updated successfully", data: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// forgot-password — body: { email }
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await forgetPasswordService(email);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// reset-password — body: { resetToken, newPassword }
const resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;
    try {
        const result = await resetPasswordService(resetToken, newPassword);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    register,
    verifyOtp,
    resendOtp,
    login,
    changePassword,
    getAllUserList,
    updateProfile,
    forgotPassword,
    resetPassword,
}
