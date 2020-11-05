const userService = require('../services/user')
const authService = require('../services/auth')
const { AppError } = require('../lib/errors')

async function login (req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) throw new AppError(400, 'Bad request')
    const { accessToken, refreshToken } = await authService.login(email, password)

    res.cookie('REFRESH_TOKEN', refreshToken, {
      maxAge: parseInt(process.env.REFRESH_TOKEN_LIFETIME)*1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false
    })
    res.cookie('ACCESS_TOKEN', accessToken, {
      maxAge: parseInt(process.env.ACCESS_TOKEN_LIFETIME)*1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false
    })

    return res.end()
  } catch (error) {
    next(error)
  }
}

async function logout (req, res, next) {
  try {
    const { userId } = req.token
    if (!userId) throw new AppError(401, 'Not authorized')

    await authService.logout(req.cookies.REFRESH_TOKEN, userId)
    res.clearCookie('ACCESS_TOKEN')
    res.clearCookie('REFRESH_TOKEN')

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
    const { REFRESH_TOKEN: refreshToken } = req.cookies
    if (!refreshToken) throw new AppError(401, 'Not authorized')
    
    const newAccessToken = await authService.getNewAccessToken(refreshToken)

    res.cookie('ACCESS_TOKEN', newAccessToken, {
      maxAge: parseInt(process.env.ACCESS_TOKEN_LIFETIME)*1000,
      httpOnly: true
    })

    return res.end()
  } catch (error) {
    next(error)
  }
}

async function sendResetPassword (req, res, next) {
  try {
    const { email } = req.body
    if (!email) throw new AppError(400, 'Bad request')
    
    await authService.sendResetPasswordMail(email)
    
    return res.end()
  } catch (error) {
    next(error)
  }
}

async function resetPassword (req, res, next) {
  try {
    const { body: { email, code, newPassword1, newPassword2 } } = req
    if (!email || !code || !newPassword1 || !newPassword2) throw new AppError(400, 'Bad request')
    if (newPassword1 !== newPassword2) throw new AppError(400, 'Passwords mismatch')

    const user = await authService.resetPassword(code, email, newPassword1)

    return res.json(user)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  logout,
  register,
  getNewAccessToken,
  sendResetPassword,
  resetPassword,
}
