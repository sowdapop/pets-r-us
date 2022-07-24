// Title: profile.js
// Name: Kayla McDanel
// Date: 07/23/22
// Assignment: 9.2 Pets-R-Us
// Description: File for profile page model


const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

let profileSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    appointment: {type: String, required: true},
    
});

profile.Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Profile", profile.Schema);
