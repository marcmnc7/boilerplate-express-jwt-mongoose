class AppError extends Error {
  constructor (statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
  }
}

function handleError (error, res) {
  if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, res)
  } else {
    sendErrorDev(error, res)
  }
}

function sendErrorProd (error, res) {
  const { statusCode = 500, message, isOperational } = error
  if (isOperational) {
    res.status(statusCode).json({
      status: 'error',
      message: message
    })
  } else {
    console.error('ERROR: ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    })
  }
}

function sendErrorDev (error, res) {
  const { statusCode = 500, message, stack } = error
  res.status(statusCode).json({
    status: 'error',
    error: error,
    message: message,
    stack: stack,
  })
}  

module.exports = {
  AppError,
  handleError,
}
