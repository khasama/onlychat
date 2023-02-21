require("dotenv").config();
require('./auth');
const express = require("express");
const app = express();
const createError = require("http-errors");
const session = require("express-session");
const passport = require("passport");

app.disable('x-powered-by');

app.use("/public", express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(
    session({
        // store: new RedisStore({ client: clientRedis }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
    req.user ? next() : res.redirect('/');
}

app.get('/', (req, res) => {
    return res.render('');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: '/hello',
        failureRedirect: '/auth/fail'
    })
);

app.get('/auth/fail', (req, res) => {
    return res.send('fail');
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) console.log(err);
    });
    return res.redirect('/');
});

app.get('/hello', isLoggedIn, (req, res) => {
    // console.log(req.user);
    return res.send(`hello ${req.user.displayName} <a href="/logout">logout</a>`);
});

// app.use((req, res, next) => {
//     next(createError.NotFound());
// });

// app.use((err, req, res, next) => {
//     return res.status(err.status).json({
//         status: "error",
//         message: err.message,
//     });
// });

module.exports = app;