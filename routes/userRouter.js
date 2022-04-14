const express=require('express');
const dbClient=require('../db/postgres')
const {v4:uuidv4}=require('uuid');

userRouter=express.Router()

userRouter.post('/signup',async(req,res)=>{
    const {name,email,password,age}=req.body;

    const user_id=uuidv4();

    const queryText="insert into users(user_id,name,email,password,age) values($1,$2,$3,$4,$5);"
    const queryValues=[user_id,name,email,password,age]

    var client
    try{
        client = await dbClient.connect()

        await client.query('BEGIN')
        const result = await client.query(queryText,queryValues)
        await client.query('COMMIT')
        
        res.status(200).send({
            message:"Signup Successfull"
        })
    } catch (e) {
        console.log(e)
        client.query('ROLLBACK', (err) => null)
        res.status(500).send()
    }finally{
        if (client) client.release()
    }

})

userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body;

    const queryText='select user_id,name,age from users where email=$1 and password=$2;'
    const queryValues=[email,password]

    try{
        await dbClient.connect()

        const result=await dbClient.query(queryText,queryValues)

        if (result.rowCount==0){
            res.status(404).send({
                message:"No user found"
            })
        }else{
            res.status(200).send(result.rows[0])
        }
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

module.exports=userRouter;