const jwt = require('jsonwebtoken')
const jwtService = require('../services/jwt')
const { AppError } = require('../lib/errors')

function allow (roles) {  
  //  * (all), user, admin
  return function (req, res, next) {
    try {
      if (roles.includes('*')) return next()

      let { ACCESS_TOKEN: encodedToken } = req.cookies
      if (!encodedToken) return next(new AppError(401, 'Not authorized'))
      
      const decodedToken = jwtService.verify(encodedToken)
      if (roles.some(item => decodedToken.roles.includes(item))) {
        req.token = decodedToken
        return next()
      }

      return next(new AppError(403, 'Not authorized'))
    } catch (error) {
      next(error)
    }
  }
}

async function verifyApiKey (req, res, next) {
  try {
    let { headers: { 'x-api-key': apiKey }} = req
    if (!apiKey) return next(new AppError(401, 'Not authorized'))
    jwtService.verify(apiKey)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  allow,
  verifyApiKey,
}
