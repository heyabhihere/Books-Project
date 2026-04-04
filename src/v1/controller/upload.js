const cloudinary = require("../../../config/cloudnary");

const uploadImage = async (req, res) => {
    try {
        const file = req.file;

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
        });

        res.json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = uploadImage
