const express = require('express')
const router = express.Router()
const blogController = require('../Controllers/blogController')
const multer = require('multer');
const storage = multer.diskStorage({
  filename: function (req,file,cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});
const upload = multer({storage: storage});

router.route('/newPost').post(upload.array('images'),blogController.newBlogPost)


module.exports = router