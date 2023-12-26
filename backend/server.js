const express = require("express")
const { connectDb } = require("./config/dbConnection")
const dotenv = require("dotenv").config()
const APIRoute = require("./routes/index");

const errorHandler = require("./middleware/errorHandler")

const app = express()

const port = process.env.PORT || 5000

connectDb()
app.use(express.json())
app.use(errorHandler)
app.use("/api", APIRoute)

app.get("/", (req, res) => {
    res.send("Access denied")
})

app.listen(port, () => {
    console.log(`Server running on port : ${port}`)
})