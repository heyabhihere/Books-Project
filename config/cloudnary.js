const { v2: cloudinary } = require("cloudinary");
const { CLOUDINARY_API_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET_KEY } = require("./envExports");

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY,
});

module.exports = cloudinary;
