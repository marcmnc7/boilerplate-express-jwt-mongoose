const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { allow } = require('../middlewares/allow')

router.post('/login', allow(['*']), authController.login)
router.post('/logout', allow(['user']), authController.logout)
router.post('/register', allow(['*']), authController.register)
router.get('/refresh-token', allow(['*']), authController.getNewAccessToken)
router.post('/send-reset-password', allow(['*']), authController.sendResetPassword)
router.post('/reset-password', allow(['*']), authController.resetPassword)

module.exports = router
