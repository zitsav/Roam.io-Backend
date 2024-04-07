const express = require('express')
const router = express.Router()
const userController = require('../Controllers/loggedInUserController')


router.route('/profile').get(userController.getUserProfile)

module.exports = router