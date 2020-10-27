const bcrypt = require('bcrypt')

async function verifyPassword (user, plainPassword) {
  return bcrypt.compareSync(plainPassword, user.password)
}

module.exports = {
  verifyPassword
}
