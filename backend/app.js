const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");

const product = require("./routes/productRoute");
const user = require("./routes/userRoute");



const app = express();

app.use(express.json());

app.use(cookieParser())

app.use("/api/v1", product);
app.use("/api/v1", user);

// middleware for errors

app.use(errorMiddleware)

module.exports = app