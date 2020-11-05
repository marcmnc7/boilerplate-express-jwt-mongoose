const User = require('../database/models/user')
const { AppError } = require('../lib/errors')


async function getOne (filters) {
  const users = await User.find(filters)
  if (users.length > 1) throw new AppError(500, 'More than one user')
  return users[0]
}


async function getMany (filters) {
  return await User.find(filters)
}

async function createOne (newUser) {
  const user = await User.findOne({ email: newUser.email })
  if (user) throw new AppError(500, 'User already exist')
  return await User.create(newUser)
}


module.exports = {
  getOne,
  getMany,
  createOne,
}
