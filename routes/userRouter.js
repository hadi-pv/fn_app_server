const express=require('express');


userRouter=express.Router()

userRouter.get('/',async(req,res)=>{
    res.status(200).send({
        messgae:"users detected"
    })
})

module.exports=userRouter;