const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
    // Add other relevant fields for the department
});

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
    departments: [departmentSchema],
}, {
    timestamps: true
});

const Institute = mongoose.model('Institute', instituteSchema);

module.exports = Institute;
