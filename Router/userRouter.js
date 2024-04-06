const express = require('express')
const router = express.Router()
const userController = require('../Controllers/userController')

router.route('/register').post(userController.registerUserController)




module.exports = router