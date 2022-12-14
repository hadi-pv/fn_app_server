
//required npm packages
const express = require('express');
require('dotenv').config()


const app=express();
app.use(express.json())

var cors = require('cors');
app.use(cors());
app.options('*',cors());
var allowCrossDomain = function(req,res,next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();  
}
app.use(allowCrossDomain);

//impoerting routes
const userRouter=require('./routes/userRouter');
const newsRouter=require('./routes/newsRouter');
const messageRouter=require('./routes/messageRouter');
const logRouter=require('./routes/logRouter');

//api's
app.use('/users',userRouter)
app.use('/news',newsRouter)
app.use('/message',messageRouter)
app.use('/logs',logRouter)


const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occured, server can't start", error);
    }
);