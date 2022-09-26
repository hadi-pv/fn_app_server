const express=require('express');
const dbClient=require('../db/postgres')
const {v4:uuidv4}=require('uuid');

userRouter=express.Router()

userRouter.post('/signup',async(req,res)=>{
    const {name,email,age}=req.body;

    const user_id=uuidv4();

    const queryText="insert into users(user_id,name,email,age) values($1,$2,$3,$4);"
    const queryValues=[user_id,name,email,age]

    var client
    try{
        client = await dbClient.connect()
        console.log('userrouter signup')
        await client.query('BEGIN')
        const result = await client.query(queryText,queryValues)
        await client.query('COMMIT')
        res.status(200).send(user_id)
        
    } catch (e) {
        console.log(e)
        client.query('ROLLBACK', (err) => null)
        res.status(500).send()
    }finally{
        if (client) client.release()
    }

    return
})

// userRouter.post('/login',async(req,res)=>{
//     const {email,password}=req.body;

//     const queryText='select user_id,name,age from users where email=$1 and password=$2;'
//     const queryValues=[email,password]

//     try{
//         await dbClient.connect()

//         const result=await dbClient.query(queryText,queryValues)

//         if (result.rowCount==0){
//             res.status(404).send({
//                 message:"No user found"
//             })
//         }else{
//             res.status(200).send(result.rows[0])
//         }
//     }catch(e){
//         console.log(e)
//         res.status(500).send()
//     }
// })

module.exports=userRouter;