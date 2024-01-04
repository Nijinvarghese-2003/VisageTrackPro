const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken");
const { INVALID_SESSION, TOKEN_MISSING } = require("../constants");

const validateToken = asyncHandler(async (req, res, next) => {

    let token;
    let authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]
        if (!token?.length) {
            res.status(400).json({ error: TOKEN_MISSING })
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: INVALID_SESSION })
            }
            req.institute = decoded.institute
            next()
        })
    }
    if (!token) {
        res.status(400).json({ error: TOKEN_MISSING })
    }
})

const validateTeacherToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]
        if (!token?.length) {
            res.status(400).json({ error: TOKEN_MISSING })
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: TOKEN_EXPIRED, tips: "LOGGIN_AGAIN" })
                return
            }
            req.teacher = decoded.teacher
            next()
        })
    }
    if (!token) {
        res.status(400).json({ error: TOKEN_MISSING })
    }
})

module.exports = { validateToken, validateTeacherToken }