const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users')
const { allow } = require('../middlewares/allow')

router.get('/', allow(['admin']), usersController.getAll)
router.get('/me', allow(['user']), usersController.getProfile)

module.exports = router
