const { PrismaClientKnownRequestError } = require('@prisma/client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function sendMessage(req, res) {
  const { senderId, receiverId, text } = req.body;

  try {
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });
    // console.log(sender);
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    // console.log(receiver);
    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
      },
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Error sending message:', error);

    if (error instanceof PrismaClientKnownRequestError) {
      // Log Prisma-specific error details
      console.error('Prisma error code:', error.code);
      console.error('Prisma meta:', error.meta);
    }

    res.status(500).json({ error: 'Failed to send message' });
  }
}

async function getMessages(req, res) {
    const { senderId, receiverId } = req.query;
  
    try {
      // Fetch messages based on senderId and receiverId
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        orderBy: { createdAt: 'asc' },
      });
  
      res.status(200).json({ messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
}
    
module.exports = {
  sendMessage,
  getMessages,
};