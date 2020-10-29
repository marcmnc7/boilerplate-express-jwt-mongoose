const bcrypt = require('bcrypt')
const userService = require('../services/user')
const RefreshToken = require('../database/models/refreshToken')
const jwtService = require('../services/jwt')
const { AppError } = require('../lib/errors')


async function login (email, password) {
  const user = await userService.getOne({ email })
  if (!user) throw new AppError(400, 'User not exists')
  
  const correctPassword = bcrypt.compareSync(password, user.password)
  if (!correctPassword) throw new AppError(400, 'Invalid password')

  const accessToken = jwtService.generateUserToken(user.id, user.roles)
  const refreshToken = jwtService.generateRefreshToken(user.id, user.roles)

  return { accessToken, refreshToken }
}

async function logout (refreshToken, userId) {
  const decodedRefreshToken = jwtService.verify(refreshToken)
  console.info(333, decodedRefreshToken)
  if (decodedRefreshToken.userId !== userId) throw new AppError(401, 'Unauthorized')
  return await RefreshToken.findOneAndDelete({ token: refreshToken })
}


async function register (email, password, roles) {
  return await userService.createOne({ email, password, roles })
}

async function getNewAccessToken (refreshToken) {
  const tokenDoc = await RefreshToken.findOne({ token: refreshToken })
  if (!tokenDoc) throw new AppError(401, 'Not authorized')
  try {
    const { userId, roles } = jwtService.verify(refreshToken)    
    return await jwtService.generateUserToken(userId, roles)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      RefreshToken.findOneAndDelete({ token: refreshToken }).catch(console.error)
    }
    throw new AppError(error)
  }
}

module.exports = {
  login,
  logout,
  register,
  getNewAccessToken,
}
