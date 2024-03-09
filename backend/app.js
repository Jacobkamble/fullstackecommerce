const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const cors = require('cors');
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");




const app = express();

app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));

app.use(express.json());

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
// const fileupload = require('express-fileupload');

// app.use(fileupload({ useTempFiles: true }))

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order)

// middleware for errors

app.use(errorMiddleware)

module.exports = app