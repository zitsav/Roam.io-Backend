const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTour(req, res) {
  const { title, price, location, userId,currency } = req.body;

  try {
    const newTour = await prisma.plansOffered.create({
      data: {
        title,
        price,
        location,
        userId,
        currency
      }
    });
    await prisma.user.update({
        where : {id : userId},

        data : {
            isOpenToGuide : true
        }
    })
    res.status(201).json({ success: true, tour: newTour });
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({ success: false, error: 'Could not create tour' });
  }
}

module.exports = {
  createTour
};
