// Name: Kayla McDanel
// Date: 07/02/22
// Assignment: 6.2 Pets-R-Us Part 3
// Description: Website using Node, Express, EJS, MongoDB, and Mongoose.


const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
    createdAT: { type: Date, default: Date.now },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
