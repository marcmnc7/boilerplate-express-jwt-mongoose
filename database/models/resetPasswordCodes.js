const mongoose = require('mongoose')
const utils = require('../../lib/utils')
const { DateTime } = require("luxon")

const resetPasswordCodes = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    expiresAt: {
      type: Number,
      required: true
    },
    used: {
      type: Boolean,
      default: false
    }
  }
)

resetPasswordCodes.pre('validate', function(next) {
  if (!this.code) {
    this.code = utils.getRandomString(10)
    this.expiresAt = DateTime.local().plus({ hours: 24 }).toSeconds()
  }
  next()
})

 
const ResetPasswordCode = mongoose.model('ResetPasswordCode', resetPasswordCodes)
 
module.exports = ResetPasswordCode
