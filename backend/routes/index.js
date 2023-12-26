const express = require('express');
const router = express.Router()
const instituteRoute = require("./instituteRoute")


router.use("/institute", instituteRoute)

module.exports = router
