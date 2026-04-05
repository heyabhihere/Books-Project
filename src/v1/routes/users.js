const express = require("express");
const router = express.Router();
const userController = require("../controller/users");
const { authenticator } = require("../../../middleware/authentication");

router.post("/register", userController.register);
router.post("/verify-otp", userController.verifyOtp);
router.post("/resend-otp", userController.resendOtp);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/change-password", authenticator, userController.changePassword);
router.get("/user/list", userController.getAllUserList);
router.put("/update-profile", authenticator, userController.updateProfile);

module.exports = router;
