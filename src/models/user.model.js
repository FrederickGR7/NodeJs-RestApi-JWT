'use strict'
const mongoose = require('mongoose');
const userSchema = mongoose.Schema({

    name: {
        type: String,
        require: true,
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
        minlength: 6
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);