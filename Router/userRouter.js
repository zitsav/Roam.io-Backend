const express = require('express')
const router = express.Router()
const userController = require('../Controllers/loggedInUserController')
const authenticateToken = require('../jwtAuthenticate')

router.route('/profile').get(authenticateToken,userController.getUserProfile)
router.route('/profile/tours/:id').get(userController.getUserGuidedTours)
router.route('/tours/:id').get(userController.getSingleTour)
router.route('/buy/tours').post(authenticateToken,userController.paymentURLGeneration)
router.route('/writereview').post(authenticateToken,userController.writeAReview)
router.route('/blog/:id').post(authenticateToken,userController.likeABlog)

module.exports = router