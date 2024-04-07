const express = require('express');
const authRoutes = require('./Router/authRouter');
const passport = require('./config/googlePassport');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const chatRoutes = require('./Router/chatRouter');
const blogRouter = require('./Router/blogRouter')
const creatorRouter = require('./Router/creatorRouter')
const userRouter = require('./Router/userRouter')
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({origin: "http://localhost:5174", credentials: "true"}));

app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended : false}))

app.use('/auth', authRoutes);
app.use('/blog',blogRouter)
app.use('/api', chatRoutes);
app.use('/creator',creatorRouter)
app.use('/user',userRouter)

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('sendMessage', (data) => {
    // Handle new message received from client
    console.log('Message received:', data);

    // Broadcast the message to the receiver
    io.emit('receiveMessage', data);
  });
});


const port = 3000
app.listen(port,()=>{
    console.log(`App listinng on port ${port}`)
})