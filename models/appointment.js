// Title: appoint.js
// Name: Kayla McDanel
// Date: 07/16/22
// Assignment: 8.2 Pets-R-Us
// Description: File for appointment page model


const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
    userName: {type: String, lowercase: true, unique: true, required: ["can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index:true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    service: {type: String, required: true},
    createdAT: { type: Date, default: Date.now },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Appointment", userSchema);
