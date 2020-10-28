const userService = require('../services/user')
const authService = require('../services/auth')
const { AppError } = require('../lib/errors')
const RefreshToken = require('../database/models/refreshToken')

async function login (req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) throw new AppError(400, 'Bad request')

    const { accessToken, refreshToken } = await authService.login(email, password)

    return res.json({ accessToken, refreshToken })
  } catch (error) {
    next(error)
  }
}

async function logout (req, res, next) {
  try {
    const { body: { refreshToken }, token: { userId } } = req
    if (!refreshToken) throw new AppError(401, 'Unauthorized')

    await authService.logout(refreshToken)
    
    return res.send('Logged out')
  } catch (error) {
    next(error)
  }
}

async function register (req, res, next) {
  try {
    const { email, password, roles = ['user'] } = req.body
    if (!email || !password) throw new AppError(400, 'Bad request')

    const user = await authService.register(email, password, roles)

    return res.json(user)    
  } catch (error) {
    next(error)
  }
}

async function getNewAccessToken (req, res, next) {
  try {
    const { body: { refreshToken }} = req
    if (!refreshToken) throw new AppError(401, 'Not authorized')
    
    const newAccessToken = await authService.getNewAccessToken(refreshToken)

    return res.json({ accessToken: newAccessToken })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  logout,
  register,
  getNewAccessToken
}
