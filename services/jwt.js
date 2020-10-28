const jwt = require("jsonwebtoken")
const RefreshToken = require('../database/models/refreshToken')
const { AppError } = require("../lib/errors")

function generateUserToken (userId, roles) {
  return jwt.sign(
    { userId, roles },
    process.env.API_SECRET,
    { expiresIn: `1 minutes`}
  )
}

function generateRefreshToken (userId, roles) {
  const token = jwt.sign(
    { userId, roles },
    process.env.API_SECRET,
    // { expiresIn: `${process.env.REFRESH_TOKEN_LIFETIME_DAYS}`}
    { expiresIn: `2 minutes`}
    )
  RefreshToken.create({ token })
  return token
}

function verify (encodedToken) {
  return jwt.verify(encodedToken, process.env.API_SECRET)
}

module.exports = {
  generateUserToken,
  generateRefreshToken,
  verify
}