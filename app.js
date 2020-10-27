// Package imports

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require("helmet")
const { verifyApiKey, allow } = require('./middlewares/allow')

// Database
const database = require('./database/connection')
database.connect('mongodb://localhost:27017/express-jwt-auth').catch(console.error)


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
process.on('unhandledRejection', err => {
  // https://medium.com/@SigniorGratiano/express-error-handling-674bfdd86139
  console.log(err.name, err.message)
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  process.exit(1)
});

module.exports = app
