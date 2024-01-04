const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the student's name"],
    },
    email: {
        type: String,
        required: [true, "Please enter the student's email address"],
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: [true, "Please enter the parent's phone number"],
    },
    registrationID: {
        type: String,
        required: [true, "Please enter the student's identification number"],
        unique: true,
    },
    remarks: String,
    department: {
        type: String,
        required: [true, "Please enter the student's department"],
    },
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute', // Reference to the Institute model
        required: [true, "Please provide the institute's ID"],
    },
    dailyLogs: [
        {
            date: {
                type: Date,
                default: Date.now,
            },
            isPresent: {
                type: Boolean,
                default: false,
            },
            remarks: String,
        },
    ],
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
