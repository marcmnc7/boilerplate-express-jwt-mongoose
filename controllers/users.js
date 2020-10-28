const userService = require('../services/user')

async function getAll (req, res, next) {
  try {
    const users = await userService.getMany({})
    return res.json(users)
  } catch (error) {
    next(error)
  }
}

async function getProfile (req, res, next) {
  try {
    const { token: { userId } } = req
    const user = await userService.getOne({ _id: userId })
    return res.json(user)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getProfile,
}
