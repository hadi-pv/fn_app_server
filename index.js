
//required npm packages
const express = require('express');
require('dotenv').config()


const app=express();
app.use(express.json())

//impoerting routes
const userRouter=require('./routes/userRouter');

//api's
app.use('/users',userRouter)


const PORT = 3000
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occured, server can't start", error);
    }
);