require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models')
const cors = require('cors')
const router = require('./routes/index')
const ErrorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(ErrorHandler)

async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }

}

start()