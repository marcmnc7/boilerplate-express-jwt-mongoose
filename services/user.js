const User = require('../database/models/user')
const { AppError } = require('../lib/errors')


async function getOne (filters) {
  return await User.findOne(filters)
}

async function createOne (newUser) {
  const user = await User.findOne({ email: newUser.email })
  if (user) throw new AppError(401, 'User already exist')
  return await User.create(newUser)
}


module.exports = {
  getOne,
  createOne,
}
