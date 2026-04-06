require('dotenv').config();

const PORT_NUMBER = process.env.PORT_NUMBER;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_MAILER_EMAIL = process.env.NODE_MAILER_EMAIL;
const NODE_MAILER_EMAIL_PASSKEY = process.env.NODE_MAILER_EMAIL_PASSKEY;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key'; // Fallback added for safety
const JWT_EXPIRE = process.env.JWT_EXPIRE ? process.env.JWT_EXPIRE.replace(/^['"]|['"]$/g, '') : '7d';
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET_KEY = process.env.CLOUDINARY_SECRET_KEY;
module.exports = {
    PORT_NUMBER,
    MONGODB_URI,
    NODE_MAILER_EMAIL,
    NODE_MAILER_EMAIL_PASSKEY,
    JWT_SECRET,
    JWT_EXPIRE,
    CLOUDINARY_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET_KEY
}