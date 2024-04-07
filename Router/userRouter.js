const express = require('express')
const router = express.Router()
const userController = require('../Controllers/loggedInUserController')


router.route('/profile').get(userController.getUserProfile)
router.route('/profile/tours/:id').get(userController.getUserGuidedTours)
router.route('/tours/:id').get(userController.getSingleTour)

module.exports = router