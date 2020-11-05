const bcrypt = require('bcrypt')
const userService = require('../services/user')
const RefreshToken = require('../database/models/refreshToken')
const jwtService = require('../services/jwt')
const emailService = require('../services/email')
const { AppError } = require('../lib/errors')
const ResetPasswordCode = require('../database/models/resetPasswordCodes')
const { DateTime } = require("luxon")

async function login (email, password) {
  const user = await userService.getOne({ email })
  if (!user) throw new AppError(400, 'User not exists')
  
  const correctPassword = bcrypt.compareSync(password, user.password)
  if (!correctPassword) throw new AppError(403, 'Not authorized')

  const accessToken = jwtService.generateUserToken(user.id, user.roles)
  const refreshToken = jwtService.generateRefreshToken(user.id, user.roles)

  return { accessToken, refreshToken }
}

async function logout (refreshToken, userId) {
  const decodedRefreshToken = jwtService.verify(refreshToken)
  if (decodedRefreshToken.userId !== userId) throw new AppError(403, 'Unauthorized')
  return await RefreshToken.findOneAndDelete({ token: refreshToken })
}


async function register (email, password, roles) {
  return await userService.createOne({ email, password, roles })
}

async function getNewAccessToken (refreshToken) {
  const tokenDoc = await RefreshToken.findOne({ token: refreshToken })
  if (!tokenDoc) throw new AppError(403, 'Not authorized')
  try {
    const { userId, roles } = jwtService.verify(refreshToken)    
    return await jwtService.generateUserToken(userId, roles)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      RefreshToken.findOneAndDelete({ token: refreshToken }).catch(console.error)
    }
    throw error
  }
}

async function sendResetPasswordMail (email) {
  const user = await userService.getOne({ email })
  if (!user) throw new AppError(403, 'Not authorized')
  const { code } = await ResetPasswordCode.create({ user: user._id })
  return await emailService.sendMail('Reset Password', `Entra en este link y usa el siguiente codigo: ${code}. Valido por 24h.`, user.email)
}

async function resetPassword (code, email, newPassword) {
  const user = await userService.getOne({ email })
  if(!user) throw new AppError(403, 'Not authorized')

  const resetPasswordCode = await ResetPasswordCode.findOne({ code, user: user._id })
  const now = DateTime.local()
  if (!resetPasswordCode ) throw new AppError(403, 'Invalid code')
  if (resetPasswordCode.used) throw new AppError(403, 'Code already used')
  if (DateTime.fromSeconds(resetPasswordCode.expiresAt) < now)  throw new AppError(403, 'Code expired')
  
  user.password = newPassword
  resetPasswordCode.used = true
  await resetPasswordCode.save()
  return await user.save()
}


module.exports = {
  login,
  logout,
  register,
  getNewAccessToken,
  sendResetPasswordMail,
  resetPassword,
}
