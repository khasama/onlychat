require("dotenv").config();
const express = require("express");
const app = express();
const createError = require("http-errors");

app.disable('x-powered-by');

app.use("/public", express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.send("Hello world");
});

app.use((req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    return res.status(err.status).json({
        status: "error",
        message: err.message,
    });
});

module.exports = app;