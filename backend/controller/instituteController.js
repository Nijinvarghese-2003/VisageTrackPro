const asyncHandler = require("express-async-handler")
const bcrypt = require('bcrypt');
const { FIELDS_MISSING, PASSWORDS_DO_NOT_MATCH, USER_ALREADY_EXISTS, USER_CREATED, SOMETHING_WENT_WRONG, INSTITUTE_NOT_FOUND, INCORRECT_PASSWORD, INSTITUTE_LOGGED_IN, INSTITUTE_DATA_UPDATED, PASSWORD_RESET_CODE_SEND, INVALID_RESET_CODE, PASSWORD_RESET_SUCCESS, TEACHERS_LIST_NOT_FOUND, TEACHERS_ADDED_SUCCESSFULLY, TEACHERS_RETRIEVED_SUCCESSFULLY, TEACHERS_NOT_FOUND, TEACHERS_UPDATED_SUCCESSFULLY, TEACHERS_DELETED_SUCCESSFULLY, INSTITUTE_CREATED, INSTITUTE_ALREADY_EXISTS, DUPLICATE_EMAILS_FOUND } = require("../constants")
const Institute = require("../models/institute")
const Teacher = require("../models/teachers");
const jwt = require("jsonwebtoken")
const transporter = require("../config/nodemailerConfig")
require("dotenv").config()
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
            error: PASSWORDS_DO_NOT_MATCH
        });
        return
    }

    const isInstituteExist = await Institute.findOne({ email })
    if (isInstituteExist) {
        res.status(400).json({ error: INSTITUTE_ALREADY_EXISTS })
        return
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
            message: INSTITUTE_CREATED, data: {
                id: newInstitute.id,
                email: newInstitute.email,
                departments: newInstitute.departments,
                name: newInstitute.name,
            }
        })
    } else {
        res.status(400).json({ error: SOMETHING_WENT_WRONG })
        return
    }
})

// @desc login institute 
// @route POST /api/institute/login
// @access Public

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ error: FIELDS_MISSING })
        return
    }

    const institute = await Institute.findOne({ email })
    if (institute) {
        if (await bcrypt.compare(password, institute.password)) {
            const token = jwt.sign({
                institute: {
                    name: institute.name,
                    email: institute.email,
                    id: institute.id
                }
            }, process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "25d" }
            )
            console.log("token", token)
            res.status(200).json({
                message: INSTITUTE_LOGGED_IN, data: {
                    id: institute.id,
                    name: institute.name,
                    email: institute.email,
                    token: token,
                    departments: institute.departments,
                    contact: institute.contact,
                    address: institute.address
                }
            })
            return

        } else {
            res.status(401).json({ error: INCORRECT_PASSWORD })
            return
        }

    } else {
        res.status(400).json({ error: INSTITUTE_NOT_FOUND })
        return
    }
})

// @desc update institute data
// @route PUT /api/institute/update
// @access Private

const updateInstitute = asyncHandler(async (req, res) => {
    const { name, email, address, contact, departments, password } = req.body;
    const id = req.institute.id
    if (!name || !email || !address || !contact || !departments || !password) {
        res.status(400).json({ error: FIELDS_MISSING })
        return
    }
    const institute = await Institute.findOne({ _id: id })
    console.log(institute)
    if (!institute) {
        res.status(400).json({ error: INSTITUTE_NOT_FOUND })
        return
    }

    if (!bcrypt.compare(password, institute.password)) {
        res.status(401).json({ error: INCORRECT_PASSWORD })
        return
    }

    institute.name = name
    institute.email = email
    institute.address = address
    institute.contact = contact
    institute.departments = departments

    const updatedInstitute = await institute.save()

    if (updateInstitute) {
        res.status(200).json({
            message: INSTITUTE_DATA_UPDATED, data: {
                id: updatedInstitute.id,
                name: updatedInstitute.name,
                email: updatedInstitute.email,
                departments: updatedInstitute.departments,
                contact: updatedInstitute.contact,
                address: updatedInstitute.address
            }
        })
        return
    }

})

// @desc Forget Password - Request Reset Link
// @route PUT /api/institute/forgetpassword
// @access Private

const requestForgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        res.status(400).json({ error: FIELDS_MISSING })
        return
    }
    try {
        const institute = await Institute.findOne({ email })

        if (!institute) {
            res.status(400).json({ error: INSTITUTE_NOT_FOUND })
            return
        }
        const resetCode = Math.floor(1000 + Math.random() * 9000);
        institute.resetCode = resetCode

        await institute.save()

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: institute.email,
            subject: "Password Reset",
            html: `<p>You are receiving this email because a password reset request has been made for your account.</p>
               <p>Please click on the following link to reset your password:</p>
               <a href="http://localhost:3030/institute/forgetpassword/${resetToken}">Reset Password</a>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: PASSWORD_RESET_CODE_SEND })
    } catch (error) {
        res.status(500).json({ error: SOMETHING_WENT_WRONG })
    }
})


// @desc Reset Password
// @route POST /api/institute/resetpassword
// @access Public

const resetPassword = asyncHandler(async (req, res) => {
    const { resetCode, password, confirm, email } = req.body

    if (!resetCode || !password || !confirm || !email) {
        res.status(400).json({ error: FIELDS_MISSING })
        return
    }
    if (password !== confirm) {
        res.status(400).json({ error: PASSWORDS_DO_NOT_MATCH })
    }
    const institute = await Institute.findOne({ email })

    if (institute) {
        if (resetCode !== institute.resetCode) {
            res.status(401).json({ error: INVALID_RESET_CODE })
        }
        const hashedPassword = bcrypt.hash(password, 10)

        institute.password = hashedPassword
        institute.resetCode = ""
        await institute.save()

        res.status(200).json({ message: PASSWORD_RESET_SUCCESS })
    } else {
        res.status(400).json({ error: INSTITUTE_NOT_FOUND })
        return
    }

})


// @desc Add Teachers
// @route POST /api/institute/addteachers
// @access Private

const addTeachersInstitute = asyncHandler(async (req, res) => {

    const { teachers } = req.body;

    // Check if teachers array is provided
    if (!teachers || !Array.isArray(teachers)) {
        res.status(400).json({ error: TEACHERS_LIST_NOT_FOUND });
        return;
    }

    const instituteId = req.institute.id;

    try {
        // Loop through the teachers array and create Teacher documents
        const createdTeachers = await Promise.all(
            teachers.map(async (teacher) => {
                const existingTeacher = await Teacher.findOne({ email: teacher.email });

                if (existingTeacher) {
                    return { error: USER_ALREADY_EXISTS, email: teacher.email };
                }


                const newTeacher = new Teacher({
                    ...teacher,
                    uid: instituteId,
                });

                console.log("activation link send to ", teacher.email)
                const activationToken = jwt.sign({
                    institute: {
                        name: teacher.name,
                        email: teacher.email,
                        uid: instituteId
                    }
                }, process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "7d" }
                )
                const mailOptions = {
                    from: process.env.EMAIL_ADDRESS,
                    to: teacher.email,
                    subject: "Account Activation",
                    html: `
                    <p>You are receiving this email because an account activation request has been made for your account.</p>
                    <p>Please click on the following link to activate your account. Note that this link will expire in 7 days:</p>
                    <a href="http://localhost:3030/teachers/activate/${activationToken}">Activate Account</a>
                       `,
                };
                console.log("activationToken", activationToken)
                await transporter.sendMail(mailOptions);
                return newTeacher.save();
            })
        );

        // const successfulTeachers = createdTeachers.filter((teacher) => !teacher.error);
        const successfulTeachers = createdTeachers
            .filter((teacher) => !teacher.error)
            .map((teacher) => teacher.toObject({ getters: true, virtuals: true, minimize: false }));

        res.status(201).json({
            message: TEACHERS_ADDED_SUCCESSFULLY,
            data: successfulTeachers,
            errors: createdTeachers.filter((teacher) => teacher.error),
        });
    } catch (error) {
        console.error(error);

        if (error.code === 11000 || error.code === 11001) {
            // Duplicate key error, likely due to duplicate email
            res.status(400).json({ error: DUPLICATE_EMAILS_FOUND });
        } else {
            res.status(500).json({ error: SOMETHING_WENT_WRONG });
        }

    }
})


// @desc View all teachers
// @route GET /api/institute/viewteachers
// @access Private

const viewAllTeachers = asyncHandler(async (req, res) => {
    const instituteId = req.institute.id
    try {

        const allTeachers = await Teacher.find({ uid: instituteId })

        if (allTeachers) {
            res.status(400).json({ message: TEACHERS_RETRIEVED_SUCCESSFULLY, data: allTeachers })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: SOMETHING_WENT_WRONG })
    }
})



// @desc Get teachers by department
// @route GET /api/institute/viewteachersbydept/
// @access Private

const getTeachersByDepartment = asyncHandler(async (req, res) => {
    const { department } = req.body
    const instituteId = req.institute.id;

    try {
        const teachersByDepartment = await Teacher.find({ uid: instituteId, departments: department });
        res.status(200).json({ message: TEACHERS_RETRIEVED_SUCCESSFULLY, data: teachersByDepartment })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: SOMETHING_WENT_WRONG })
    }
})


// @desc Update teacher by ID
// @route PUT /api/institute/updateteacher/:id
// @access Private

const updateTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let updatedData = req.body

    if (!updatedData) {
        res.status(400).json({ error: FIELDS_MISSING })
        return
    }

    const instituteId = req.institute.id

    try {

        const teacherToUpdate = await Teacher.findOne({ _id: id, uid: instituteId })
        console.log(teacherToUpdate)
        if (!teacherToUpdate) {
            res.status(404).json({ error: TEACHERS_NOT_FOUND })
        }

        if (updatedData.password) {
            const hashedPassword = await bcrypt.hash(updatedData.password, 10);
            updatedData = { ...updatedData, password: hashedPassword };
        }

        // Update the teacher with the new data
        Object.assign(teacherToUpdate, updatedData);
        const updatedTeacher = await teacherToUpdate.save()
        const filteredUpdatedTeacher = { ...updatedTeacher.toObject({ getters: true, virtuals: true, minimize: false }) };
        delete filteredUpdatedTeacher.password;

        res.status(200).json({ message: TEACHERS_UPDATED_SUCCESSFULLY, data: filteredUpdatedTeacher })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: SOMETHING_WENT_WRONG })
    }
})


// @desc Delete teacher by ID
// @route DELETE /api/institute/deleteteacher/:id
// @access Private

const deleteTeacherById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const instituteId = req.institute.id

    try {

        const deletedTeacher = await Teacher.findOneAndDelete({ _id: id, uid: instituteId })

        if (!deletedTeacher) {
            res.status(404).json({ error: TEACHERS_NOT_FOUND })
        }

        res.status(200).json({ message: TEACHERS_DELETED_SUCCESSFULLY, data: deletedTeacher })
    } catch (error) {
        res.status(500).json({ error: SOMETHING_WENT_WRONG })
    }
})


module.exports = {
    register,
    login,
    updateInstitute,
    requestForgetPassword,
    resetPassword,
    addTeachersInstitute,
    viewAllTeachers,
    getTeachersByDepartment,
    deleteTeacherById,
    updateTeacher
}