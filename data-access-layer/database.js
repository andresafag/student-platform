const mongoose  = require('mongoose');
mongoose.set('strictQuery', false)

// CATCH ERROR DURING CONENCTION
connectDb().catch(err=> console.log(err));

// CONNECTING DATABASE
 async function connectDb(){
   await  mongoose.connect('mongodb://127.0.0.1:27017/student_platform');
   console.log("connected to the database");
 }



