require("dotenv").config();
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const path = require('path');

module.exports = {
    verifyAdmin: (req, res, next) => {
        const token = req.session.access_token;
        if (!token) {
            return res.redirect("/login");
        }

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, payload) => {
                if (!err) {
                    const role = payload.role;
                    if (role === "admin") {
                        next();
                    } else {
                        res.redirect("/login");
                    }

                } else {
                    req.session.access_token = undefined;
                    return res.redirect("/login");
                }
            }
        );
    },
    checkRefererEmbed: (req, res, next) => {
        const regex = new RegExp('^(?:https?:\\/\\/)?(?:[^@\\/\\n]+@)?(?:www\\.)?([^:\\/\\n]+)', 'igm');
        const headers = req.headers;
        const referer = headers.referer;
        const whitelist = ['kervice.tk', 'api.scats.tk', 'localhost'];
        if (referer) {
            const origin = regex.exec(referer)[1];
            if (whitelist.indexOf(origin) !== -1) {
                next();
            } else {
                return res.sendFile(path.resolve(__dirname, '../public/img/f.jpg'));
            }
        }
        next();
    },
};
