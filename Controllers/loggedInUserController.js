const { PrismaClient } = require('@prisma/client');

require('dotenv').config()

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
    if(!guidedTours){
        res.status(404).send('Uh oh the resource does not exist')
        return
    }

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
        const tour = await prisma.plansOffered.findUnique({
            where : {
                id : req.body.tourId
            }
        })
        if(!tour){
            res.status(404).send('Tour Not Found')
            return
        }
        const prevArr = [];
        prevArr.push({
                price_data: {
                    currency : tour.currency,
                    unit_amount : tour.price,
                    product_data : {
                        name : tour.title
                    }
                },
                quantity : 1
            })
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['card'],
            mode : 'payment',
            line_items : prevArr,
            success_url : process.env.SUCCESS_URL,
            cancel_url : process.env.CANCEL_URL
        })
        res.status(200).json({url : session.url})
    }
    catch(err){
        console.log('Error in generating payment url', err.message)
        res.status(500).send('internal Server Error')
    }
}

async function writeAReview(req,res){
  const { rating, text, plansOfferedId } = req.body;
  const newReview = await prisma.review.create({
    data : {
      rating,
      text,
      plansOfferedId
    }
  })
  const planOffered = await prisma.plansOffered.findUnique({
    where : {
      id : plansOfferedId
    }
  }) 
  let currNumOfReviews = planOffered.totalRatings
  let newRating = ((planOffered.overallRating*currNumOfReviews) + rating)/(currNumOfReviews+1)
  currNumOfReviews += 1
  await prisma.plansOffered.update({
    where : {
      id : plansOfferedId
    },
    data : {
      totalRatings : currNumOfReviews,
      overallRating : newRating
    }
  })
}
async function likeABlog(req,res){
  const currBlog = prisma.blog.findUnique({
    where : {
      id : req.params.id
    }
  })
  await prisma.blog.update({
    where : {
      id : req.params.id
    },
    data : {
      likes : currBlog.likes + 1
    }
  })
}
module.exports = {
  getUserProfile,
  getUserGuidedTours,
  getSingleTour,
  paymentURLGeneration,
  writeAReview,
  likeABlog
}
