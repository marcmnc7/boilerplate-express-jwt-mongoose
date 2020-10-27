const jwt = require("jsonwebtoken")

function generateUserToken (user) {
  return jwt.sign({ userId: user.id, roles: user.roles }, process.env.API_SECRET)
}

function verify (encodedToken) {
  return jwt.verify(encodedToken, process.env.API_SECRET)
}

module.exports = {
  generateUserToken,
  verify
}