const jwt = require("jsonwebtoken")

function generateUserToken (user) {
  return jwt.sign({ userId: user.id, roles: user.roles }, 'apiSecretKey')
}

function verify (encodedToken) {
  return jwt.verify(encodedToken, 'apiSecretKey')
}

module.exports = {
  generateUserToken,
  verify
}