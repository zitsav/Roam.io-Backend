const express = require('express')
const router = express.Router()
const userController = require('../Controllers/loggedInUserController')


router.route('/profile').get(userController.getUserProfile)
router.route('/profile/tours/:id').get(userController.getUserGuidedTours)
router.route('/tours/:id').get(userController.getSingleTour)
router.route('/buy/tours').post(userController.paymentURLGeneration)
router.route('/writereview').post(userController.writeAReview)

module.exports = router