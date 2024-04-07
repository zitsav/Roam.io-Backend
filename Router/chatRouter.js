const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/chatController');

router.post('/messages', chatController.sendMessage);
router.get('/messages', chatController.getMessages);

module.exports = router;