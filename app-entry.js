const express = require('express'),
      app = express(),
      connectDB = require('./data-access-layer/database.js'),
      port = app.set('port', 8001 || process.env.PORT),
      generalRoutes = require('./routes/generalRoutes.js'),
      studentRoutes = require('./routes/studentRoutes.js'),
      teacherRoutes = require('./routes/teacherRoutes.js'),
      ejs = require('ejs'),
      session = require('express-session'),
      passport = require('passport'),
      localStrategy = require('./services/passport-users.js').localStrategy,
      server = require('http').createServer(app),
      io = require("socket.io")(server),
      MongoStore = require('connect-mongo'),
      addStudentsToSpecificCourses = require('./socketLogic.js').addStudentsToSpecificCourses,
      sendMsg = require('./socketLogic.js').sendMsg,
      connectedUsers = require('./socketLogic.js').connectedUsers,
      disconnectedUsers = require('./socketLogic.js').disconnectedUsers,
      pushMessages = require('./services/redis.js').pushMessages,
      messagesCollections = require('./services/redis.js').messagesCollections,
      pushMsgToAll = require('./services/redis.js').pushMsgToAll
      




const sessionMiddleware = session({
  secret: 'catty',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl:'mongodb://127.0.0.1:27017/test-app',
    stringify:true,
      }),
  cookie: {
    maxAge:1200000
    }
})

app.use(express.static('public'));
app.use(sessionMiddleware);
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('view engine', 'ejs');
passport.use(localStrategy);
app.use(passport.initialize());
app.use(passport.session());
app.use(studentRoutes);
app.use(teacherRoutes);
app.use(generalRoutes);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(new Error('unauthorized'))
    }
});


// Socket connection
io.on('connection', (socket) => {

  if (socket.request.user.role == "student") {
  // 
  //The socket.join will have the current user join the room named after the course he/she is enrolled in
  socket.join(`${socket.request.user.currentCourse[0]["course_name"]}`)
  console.log(socket.request.user.currentCourse[0]["course_name"])
  // A variable "usr" is create where the name and the socket associated with it are kept in
  const usr = {name:socket.request.user.name, sckId:socket.id}
// 
  socket.on("message list collection", ()=>{
    messagesCollections(socket.request.user.name)
    .then(data=>{
      socket.emit("user messages", data)
  })    
  })
// 
//----------------------------------------------------------------------------------------------------------------------
  addStudentsToSpecificCourses(socket.request.user.currentCourse[0]["course_name"], usr)  
  // 
  //Sending message to single user
    socket.on("sending msg to a particular user", async (user, msg)=>{         
    pushMessages(user, socket.request.user.name, msg)
    io.to(sendMsg(user,msg, socket.request.user.name, socket.request.user.currentCourse[0])).in(socket.request.user.currentCourse[0]).emit('msg', `${socket.request.user.name}: `, `${msg}`)
  })
  io.to(socket.request.user.currentCourse[0]["course_name"]).emit("pass connected users", connectedUsers(socket.request.user.currentCourse[0]["course_name"]))
// 
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  socket.on("sending msg to all users", (msg)=>{
    socket.broadcast.to(socket.request.user.currentCourse[0]["course_name"]).emit("message to everyone", msg, socket.request.user.name)
    console.log("usuario " + socket.id)
    io.to(socket.id).in(socket.request.user.currentCourse[0]).emit("msg to same sender", msg)
    pushMsgToAll(connectedUsers(socket.request.user.currentCourse[0]["course_name"]),socket.request.user.name, msg)
// 
  })
  // 
  //Socket disconnection
  socket.on('disconnect', ()=>{
    io.to(socket.request.user.currentCourse[0]["course_name"]).emit("pass connected users", disconnectedUsers(socket.request.user.currentCourse[0]["course_name"], usr)) 
    socket.leave(`${socket.request.user.currentCourse[0]["course_name"]}`)
  })
  }
})

//Server listening
server.listen(app.get('port'), ()=>{
  console.log("connected to port ", app.get('port'));
});



















 







