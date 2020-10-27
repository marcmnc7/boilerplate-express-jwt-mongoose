// TODO:
  // REFRESH TOKEN
  // GOOGLE AUTH

// Package imports

const express = require('express')
const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)})
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require("helmet")
const { verifyApiKey, allow } = require('./middlewares/allow')
const { handleError } = require('./lib/errors')

// Database
const database = require('./database/connection')
database.connect(process.env.DATABASE_URI).catch(error => {
  throw new Error('Mongoose cant connect to DB', error)
})


// Router imports
const authRouter = require('./routes/auth')


// General middlewares

const app = express()
app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(verifyApiKey)

// Router middlewares

app.use('/test', (req, res, next) => {
  res.send('API is working')
})

app.use('/auth', allow(['*']), authRouter)

app.use('/private', allow(['user']), (req, res, next) => {
  res.send('Private page')
})
app.use('/public', allow(['*']), (req, res, next) => {
  res.send('Public page')
})
app.use('/admin', allow(['admin']), (req, res, next) => {
  res.send('Public page')
})


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
