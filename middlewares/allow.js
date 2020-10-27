const jwt = require('jsonwebtoken')
const jwtService = require('../services/jwt')

function allow (roles) {  
  return function (req, res, next) {
    try {
      if (roles.includes('*')) return next()

      let { headers: { authorization: encodedToken } } = req
      if (!encodedToken) throw new Error('Not authorized')

      const { roles: userRoles } = jwtService.verify(encodedToken.replace('Bearer ', ''))
      if (roles.some(item => userRoles.includes(item))) return next()

      throw new Error('Not authorized')
    } catch (error) {
      next(error)
    }
  }
}

async function verifyApiKey (req, res, next) {
  try {
    let { headers: { 'x-api-key': apiKey }} = req
    if (!apiKey) return next(new Error('Not authorized'))
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
