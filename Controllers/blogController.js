require('dotenv').config()

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

async function newBlogPost(req,res,next){
try {
    const { title, text, authorId, captions } = req.body;
    const imageUrls = []
    for(let i = 0;i<req.files.length;i++){
        const result = await cloudinary.uploader.upload(req.files[i].path)
        imageUrls.push(result.secure_url)
    }
    // Create blog and related images
    const blog = await prisma.blog.create({
      data: {
        title,
        text,
        authorId,
        image: {
          createMany: {
            data: imageUrls.map((url, index) => ({
              imageURL: url,
              caption: captions[index] || ""
            }))
          }
        }
      },
      include: {
        image: true
      }
    });

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
}
module.exports = {newBlogPost}