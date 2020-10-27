const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
 
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      required: true,
    },
  },
  { 
    timestamps: true
  },
);

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 10)
  }
  next()
})
 
const User = mongoose.model('User', userSchema)
 
module.exports = User
