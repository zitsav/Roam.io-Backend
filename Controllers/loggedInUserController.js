const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getUserProfile(req, res) {
  const userId = req.body.userId;
  console.log(userId)
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

module.exports = {
  getUserProfile
}
