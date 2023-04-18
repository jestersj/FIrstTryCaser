require('dotenv').config()
const express = require('express')
const db = require('./models/index')
const models = require('./models')
const cors = require('cors')
const router = require('./routes/index')
const ErrorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require("path");
const fileUploads = require('express-fileupload')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUploads({}))
app.use('/api', router)

app.use(ErrorHandler)

async function start() {
    try {
        await db.sequelize.authenticate()
        app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }

}

start()