const users = require("../src/models/user")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/envExports");


const authenticator = async (req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];

        if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ msg: "Authorization header missing or invalid" });
        }

        const token = bearerHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await users.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Error:", err.message);
        res.status(403).json({ msg: "Invalid or expired token" });
    }
};
const optionalAuthenticator = async (req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];

        if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
            return next(); // Proceed without setting req.user
        }

        const token = bearerHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await users.findById(decoded.userId);
        if (user) {
            req.user = user;
        }
        next();
    } catch (err) {
        // Log but do not block the route, allow unauthenticated access to proceed
        console.error("Optional Auth Error:", err.message);
        next();
    }
};

module.exports = { authenticator, optionalAuthenticator };