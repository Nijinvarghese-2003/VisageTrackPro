const mongoose = require('mongoose');

const instituteSchema = new mongoose.Schema({
    name: { type: String, required: [true, "please add institute name"] },
    email: { type: String, required: true, unique: [true, "Email address already exists"] },
    password: { type: String, required: [true, "Please provide a password"] },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
        country: { type: String },
    },
    contact: {
        phone: { type: String },
        website: { type: String },
    },
    departments: { type: [String], required: true },
    resetCode: { type: String, require: false, default: "" }
}, {
    timestamps: true
});

const Institute = mongoose.model('Institute', instituteSchema);

module.exports = Institute;
