require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models')
const cors = require('cors')
const router = require('./routes/index')
const ErrorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require("path");
const fileUploads = require('express-fileupload')

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUploads({}))
app.use('/api', router)

app.use(ErrorHandler)

async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter: true})
        app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }

}

start()