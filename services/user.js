const User = require('../database/models/user')

async function getOne (filters) {
  return await User.findOne(filters)
}

async function createOne (newUser) {
  const user = await User.findOne({ email: newUser.email })
  if (user) throw new Error('User already exists')
  return await User.create(newUser)
}


module.exports = {
  getOne,
  createOne,
}
