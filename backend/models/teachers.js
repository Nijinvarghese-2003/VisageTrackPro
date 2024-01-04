const mongoose = require("mongoose")

const techerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email address"],
        unique: [true, "Email address already exists"]
    },
    password: {
        type: String,
        required: false
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    subject: {
        type: [String],
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    departments: {
        type: [String],
        required: [true, "Please add departments"],
    },
    phone: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true,
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Institute"
    }
})

const Teacher = mongoose.model("Teacher", techerSchema)

module.exports = Teacher