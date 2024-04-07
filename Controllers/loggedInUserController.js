const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

async function getUserProfile(req, res) {
  const userId = req.body.userId;
  try {
    const userProfile = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        Blog: true,
        PlansOffered: true
      }
    });

    if (!userProfile) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, userProfile });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ success: false, error: 'Could not retrieve user profile' });
  }
}

async function getUserGuidedTours(req, res) {
  const userId = req.params.userId; // Assuming userId is passed in the request URL params

  try {
    const guidedTours = await prisma.plansOffered.findMany({
      where: {
        userId: userId
      },
      include: {
        guide: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(200).json({ success: true, guidedTours });
  } catch (error) {
    console.error('Error retrieving guided tours:', error);
    res.status(500).json({ success: false, error: 'Could not retrieve guided tours' });
  }
}

async function getSingleTour(req,res){
    const tourId = req.params.tourId
    try{
        const guidedTour = await prisma.plansOffered.findUnique({
            where : {
                id : tourId
            }
        })
        if(!guidedTour){
            res.status(404).send('Uh oh the resource does not exist')
            return
        }
    }
    catch(err){
        console.log('Error retriving single tour', err)
        res.status(500).json({ success : false, error: 'Internal Server Error'})
    }
}

async function paymentURLGeneration(req,res){
    try{

    }
    catch(err){
        console.log('Error in generating payment url', err.message)
        res.status(500).send('internal Server Error')
    }
}
module.exports = {
  getUserProfile,
  getUserGuidedTours,
  getSingleTour,
  paymentURLGeneration
}
