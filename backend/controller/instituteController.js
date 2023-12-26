const asyncHandler = require("express-async-handler")
const bcrypt = require('bcrypt');
const { FIELDS_MISSING, PASSWORDS_DO_NOT_MATCH, USER_ALREADY_EXISTS, USER_CREATED, SOMETHING_WENT_WRONG } = require("../constants")
const Institute = require("../models/institute")

// @desc register new institute 
// @route POST /api/institute/register
// @access Public

const register = asyncHandler(async (req, res) => {
    const { name, email, password, confirm, address, contact, departments } = req.body
    // res.json({ message: "INSTITUTE CREATED" + name })
    if (!name || !email || !password || !confirm || !address || !contact || !departments) {
        res.status(400).json({ error: FIELDS_MISSING })
        return
    }

    if (password !== confirm) {
        return res.status(400).json({
            error: PASSWORDS_DO_NOT_MATCH,
        });
    }

    const isInstituteExist = await Institute.findOne({ email })
    if (isInstituteExist) {
        res.status(400).json({ error: USER_ALREADY_EXISTS })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newInstitute = new Institute({
        name,
        email,
        password: hashedPassword,
        address,
        contact,
        departments
    });

    // Save the new institute to the database
    const savedInstitute = await newInstitute.save();
    // res.json({ name, email, password, confirm, address, contact, departments })
    console.log(name, email, password, confirm, address, contact, departments)
    if (savedInstitute) {
        res.status(201).json({
            message: USER_CREATED, data: {
                id: newInstitute.id,
                email: newInstitute.email,
                departments: newInstitute.departments,
                name: newInstitute.name,
            }
        })
    } else {
        res.status(400).json({ error: SOMETHING_WENT_WRONG })
    }


})

// @desc login institute 
// @route POST /api/institute/login
// @access Public

const login = asyncHandler(async (req, res) => {
    res.json({ message: "Login institute" })
})


module.exports = { register, login }