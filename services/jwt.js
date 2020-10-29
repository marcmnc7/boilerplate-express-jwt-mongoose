const jwt = require("jsonwebtoken")
const RefreshToken = require('../database/models/refreshToken')
const { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME, API_SECRET } = process.env

function generateUserToken (userId, roles) {
  return jwt.sign(
    { userId, roles },
    API_SECRET,
    { expiresIn: parseInt(ACCESS_TOKEN_LIFETIME)}
  )
}

function generateRefreshToken (userId, roles) {
  const token = jwt.sign(
    { userId, roles },
    API_SECRET,
    { expiresIn: parseInt(REFRESH_TOKEN_LIFETIME) }
    )
  RefreshToken.create({ token })
  return token
}

function verify (encodedToken) {
  return jwt.verify(encodedToken, API_SECRET)
}

module.exports = {
  generateUserToken,
  generateRefreshToken,
  verify
}