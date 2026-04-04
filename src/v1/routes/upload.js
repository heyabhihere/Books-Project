const express = require("express");
const router = express.Router();
const uploadImage = require("../controller/upload");
const upload = require("../../../middleware/upload");
const { authenticator } = require("../../../middleware/authentication");

router.post("/upload", authenticator, upload.single("image"), uploadImage);

module.exports = router;
