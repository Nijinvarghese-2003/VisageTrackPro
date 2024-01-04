const asyncHandler = require("express-async-handler")
const { FIELDS_MISSING, PASSWORDS_DO_NOT_MATCH, TEACHERS_NOT_FOUND, SOMETHING_WENT_WRONG, TEACHERS_LOGGED_IN, INCORRECT_PASSWORD, TEACHER_NOT_ACTIVATED, TEACHER_ACTIVATED, TEACHER_ALREADY_ACTIVATED } = require("../constants")
const Teacher = require("../models/teachers")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const activate = asyncHandler(async (req, res) => {

    const { password, confirm, email } = req.body
    const instituteId = req.institute.uid

    if (!password || !confirm || !email) {
        res.status(400).json({ error: FIELDS_MISSING })
        return
    }

    if (password !== confirm) {
        res.status(400).json({ error: PASSWORDS_DO_NOT_MATCH })
        return
    }

    try {
        const teacher = await Teacher.findOne({ uid: instituteId, email })

        if (!teacher) {
            res.status(404).json({ error: TEACHERS_NOT_FOUND })
            return
        }

        const hashedPassword = bcrypt.hash(password, 10)
        teacher.password = hashedPassword
        teacher.isActivated = true

        const activatedTeacher = await teacher.save()
        const filteredActivatedTeacher = { ...activatedTeacher.toObject({ getters: true, virtuals: true, minimize: false }) }
        delete filteredActivatedTeacher.password

        const nextAuthToken = jwt.sign({
            teacher: {
                name: teacher.name,
                email: teacher.email,
                uid: instituteId
            }
        }, process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "25d" }
        )
        filteredActivatedTeacher.token = nextAuthToken;

        if (teacher.isActivated) {
            res.status(200).json({ message: TEACHER_ALREADY_ACTIVATED, data: filteredActivatedTeacher })
            return
        }

        res.status(200).json({
            message: TEACHER_ACTIVATED, data: filteredActivatedTeacher
        })

    } catch (error) {
        res.status(500).json({ error: SOMETHING_WENT_WRONG })
    }


})

const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    const instituteId = req.teacher.uid

    if (!email || !password) {
        res.status(400).json({ error: FIELDS_MISSING })
        return
    }

    const teacher = await Teacher.findOne({ uid: instituteId, email })

    if (!teacher) {
        res.status(404).json({ error: TEACHERS_NOT_FOUND })
        return
    }

    if (!teacher.isActivated) {
        res.status(401).json({ error: TEACHER_NOT_ACTIVATED, tips: "ASK INSTITUTE ADMIN TO RESEND A ACTIVATION MAIL" })
        return
    }

    if (password !== teacher.password) {
        res.status(401).json({ error: INCORRECT_PASSWORD })
        return
    }

    const filteredTeacher = { ...teacher.toObject({ getters: true, virtuals: true, minimize: false }) }
    delete filteredTeacher.password

    const nextAuthToken = jwt.sign({
        teacher: {
            name: teacher.name,
            email: teacher.email,
            uid: instituteId
        }
    }, process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "25d" }
    )
    filteredTeacher.token = nextAuthToken;

    res.status(200).json({ message: TEACHERS_LOGGED_IN, data: filteredTeacher })

})

const addStudents = asyncHandler(async (req, res) => {

    const { } = req.body
})



module.exports = { activate, login, addStudents }
// add validator to login also if expired or invalid token say ask your institute admin to update or send new request to email