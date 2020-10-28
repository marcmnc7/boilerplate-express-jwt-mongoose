// TODO:
  // GOOGLE AUTH
  // Reset password mails, etc.

// Package imports

const express = require('express')
const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)})
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require("helmet")
const { verifyApiKey } = require('./middlewares/allow')
const { handleError } = require('./lib/errors')

// Database
const database = require('./database/connection')
database.connect(process.env.DATABASE_URI).catch(error => {
  throw new Error('Mongoose cant connect to DB', error)
})


// Router imports
const authRouter = require('./routes/auth')
const userRouter = require('./routes/users')


// General middlewares

const app = express()
app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Testing route

app.use('/check', (req, res, next) => {
  res.send('API is working')
})


// Router middlewares
app.use(verifyApiKey)

app.use('/auth', authRouter)
app.use('/users', userRouter)

// Error management
app.use((err, req, res, next) => {
  handleError(err, res)
})

process.on('unhandledRejection', error => {
  // https://medium.com/@SigniorGratiano/express-error-handling-674bfdd86139
  console.log(error.name, error.message)
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  process.exit(1)
});

module.exports = app
