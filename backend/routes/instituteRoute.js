const express = require('express');
const router = express.Router()
const { register,
    login,
    requestForgetPassword,
    resetPassword,
    updateInstitute,
    addTeachersInstitute,
    deleteTeacherById,
    getTeachersByDepartment,
    updateTeacher,
    viewAllTeachers,
} = require("../controller/instituteController")
const { validateToken } = require("../middleware/validateTokenHandler")

// public routes
router.post("/register", register)
router.post("/login", login)

// private routes
router.use(validateToken)

router.post("/forgetpassword", requestForgetPassword)
router.post("/update", updateInstitute)
router.post("/resetpassword", resetPassword)
router.post("/addteachers", addTeachersInstitute);
router.get("/viewteachers", viewAllTeachers);
router.get("/viewteachersbydept", getTeachersByDepartment);
router.put("/updateteacher/:id", updateTeacher);
router.delete("/deleteteacher/:id", deleteTeacherById);

module.exports = router