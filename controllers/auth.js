const jwtService = require('../services/jwt')
const userService = require('../services/user')
const authService = require('../services/auth')
const { AppError } = require('../lib/errors')

async function login (req, res, next) {
  const { email, password } = req.body

  const user = await userService.getOne({ email })
  if (!user) return next(new AppError(400, 'User not exists'))

  const correctPassword = await authService.verifyPassword(user, password)
  if (!correctPassword) return next(new AppError(400, 'Invalid password'))

  const token = jwtService.generateUserToken(user)

  res.json({ token })
}

function logout (req, res, next) {
  res.send('respond with a resource');
}

async function register (req, res, next) {
  try {
    const { email, password } = req.body
    const user = await userService.createOne({ email, password })
    res.json(user)    
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  logout,
  register
}
