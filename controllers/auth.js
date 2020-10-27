const jwtService = require('../services/jwt')
const userService = require('../services/user')
const authService = require('../services/auth')

async function login (req, res, next) {
  const { email, password } = req.body

  const user = await userService.getOne({ email })
  if (!user) throw new Error('Invalid user')

  const correctPassword = await authService.verifyPassword(user, password)
  if (!correctPassword) throw new Error('Invalid password')

  const token = jwtService.generateUserToken(user)

  res.json({ token })
}

function logout (req, res, next) {
  res.send('respond with a resource');
}

async function register (req, res, next) {
  const { email, password } = req.body
  const user = await userService.createOne({ email, password })
  res.json(user)
}

module.exports = {
  login,
  logout,
  register
}
