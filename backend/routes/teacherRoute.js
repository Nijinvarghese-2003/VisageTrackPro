const express = require("express")
const { login, activate } = require("../controller/teacherController")
const { validateToken, validateTeacherToken } = require("../middleware/validateTokenHandler")

const router = express.Router()


router.post("/activate", validateToken, activate)

router.post("/login", login)



module.exports = router