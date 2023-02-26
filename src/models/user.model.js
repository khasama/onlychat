const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        },
        avatar: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        googleId: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
