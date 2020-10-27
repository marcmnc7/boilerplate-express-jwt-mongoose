const mongoose = require('mongoose')

mongoose.connection.on('connected', () => {
  console.info('Mongoose connected')
})

mongoose.connection.on('error', (error) => {
  console.error(`Mongoose error: ${error}`)
})

process.on('SIGINT', () => {
  mongoose.connection.close(function () {
    console.info('Mongoose disconnected')
    process.exit(0)
  })
})

function connect (uri) {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: process.env.NODE_ENV !== 'production',
  })
}

module.exports = {
  connect,
}
