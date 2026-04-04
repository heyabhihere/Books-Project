const express = require("express");
const cors = require("cors");
const { PORT_NUMBER } = require("./config/envExports");
const connectDB = require("./config/db");
const app = express()
const userRoute = require("./src/v1/routes/users");
const bookRoute = require('./src/v1/routes/books');
const uploadRoute = require('./src/v1/routes/upload')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();
app.use("/api/v1/", userRoute);
app.use("/api/v1", bookRoute);
app.use("/api/v1", uploadRoute)
app.listen(PORT_NUMBER, () => {
    console.log(`Server is running on port ${PORT_NUMBER}`);
});
