const { loginValidation, changePasswordValidation, userRegister, updateProfileValidation } = require("../../utills/validations/users");
const Users = require('../../models/user');
const { registerUser, verifyOtp: verifyOtpService, loginUser, changePasswordService, userList, updateProfileService } = require("../services/users");

//signup
const register = async (req, res) => {
    try {
        await userRegister.validateAsync(req.body);
        const { email } = req.body;
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exist" });
        }
        const result = await registerUser(req.body);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//verify-otp
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const result = await verifyOtpService(email, otp);
        res.status(200).json({ message: "Email verified successfully", token: result.token });
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

module.exports = { register, verifyOtp, login, changePassword, getAllUserList, updateProfile }
