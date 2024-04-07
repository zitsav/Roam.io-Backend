const express = require('express')
const router = express.Router()
const creatorController = require('../Controllers/newTourController')

router.route('/newtour').post(creatorController.createTour)

module.exports = router