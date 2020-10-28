const jwtService = require('../services/jwt')
const userService = require('../services/user')
const authService = require('../services/auth')
const { AppError } = require('../lib/errors')
const RefreshToken = require('../database/models/refreshToken')

async function login (req, res, next) {
  try {
    const { email, password } = req.body
  
    const user = await userService.getOne({ email })
    if (!user) return next(new AppError(400, 'User not exists'))
   
    const correctPassword = await authService.verifyPassword(user, password)
    if (!correctPassword) return next(new AppError(400, 'Invalid password'))
  
    const accessToken = jwtService.generateUserToken(user.id, user.roles)
    const refreshToken = jwtService.generateRefreshToken(user.id, user.roles)
  
    return res.json({ token: accessToken, refreshToken })
  } catch (error) {
    next(error)
  }
}

async function logout (req, res, next) {
  try {
    const { body: { refreshToken }, token: { userId } } = req
    if (!refreshToken) throw new AppError(401, 'Unauthorized')
    const decodedRefreshToken = jwtService.verify(refreshToken)
    if (decodedRefreshToken.userId !== userId) throw new AppError(401, 'Unauthorized')
    await RefreshToken.findOneAndDelete({ token: refreshToken })
    return res.send('Logged out')
  } catch (error) {
    next(error)
  }
}

async function register (req, res, next) {
  try {
    const { email, password } = req.body
    const user = await userService.createOne({ email, password })
    return res.json(user)    
  } catch (error) {
    next(error)
  }
}

async function refreshToken (req, res, next) {
  try {
    let { body: { refreshToken }} = req
    if (!refreshToken) throw new AppError(401, 'Not authorized')

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken })
    if (!tokenDoc) throw new AppError(401, 'Not authorized')

    const { userId, roles } = jwtService.verify(refreshToken)
    const newAccessToken = await jwtService.generateUserToken(userId, roles)

    return res.json({ token:  newAccessToken })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  logout,
  register,
  refreshToken
}
