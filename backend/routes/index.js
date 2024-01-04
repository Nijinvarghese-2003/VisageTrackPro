const express = require('express');
const router = express.Router()
const instituteRoute = require("./instituteRoute")
const teacherRoute = require("./teacherRoute")


router.use("/institute", instituteRoute)
router.use("/teachers", teacherRoute)

module.exports = router
