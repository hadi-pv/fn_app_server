const express=require('express');
const dbClient=require('../db/postgres')
const {v4:uuidv4}=require('uuid');

logRouter=express.Router()

logRouter.post('/',async(req,res)=>{
    const id=uuidv4()
    const {news_id,user_id,task,send_to,time_in_sec}=req.body

    const queryText="insert into logs(id,news_id,user_id,task,send_to,time_in_sec) values($1,$2,$3,$4,$5,$6);"
    const queryValues=[id,news_id,user_id,task,send_to,time_in_sec]

    var client
    try{
        client= await dbClient.connect()
        await client.query('BEGIN')
        const result=await client.query(queryText,queryValues)
        await client.query('COMMIT')

        res.status(200).send({
            message:"success"
        })
    }catch(e){
        console.log(e)
        client.query('ROLLBACK',(err)=>null)
        res.status(500).send({
            message:"Server Error"
        })
    }finally{
        if (client){
            client.release()
        }
    }
})

logRouter.post('/news',async(req,res)=>{
    const news_id=req.body.news_id

    const queryText='select * from logs where news_id=$1'
    const queryValues=[news_id]

    try{
        await dbClient.connect()
        const result=await dbClient.query(queryText,queryValues)
        
        if(result.rowCount==0){
            res.status(200).send({})
        }

        res.status(200).send({
            message:Array.from(
                result.rows,(row)=>{
                    const {id,news_id,user_id,task,send_to,time_in_sec}=row
                    return {id,news_id,user_id,task,send_to,time_in_sec}
                }
            )
        })
    }catch(e){
        console.log(e)
        res.status(500).send({
            message:"Server Error"
        })
    }
})

logRouter.post('/user',async(req,res)=>{
    const user_id=req.body.user_id

    const queryText='select * from logs where user_id=$1'
    const queryValues=[user_id]

    try{
        await dbClient.connect()
        const result=await dbClient.query(queryText,queryValues)

        if(result.rowCount==0){
            res.status(200).send({})
        }

        res.status(200).send({
            message:Array.from(
                result.rows,(row)=>{
                    const {id,news_id,user_id,task,send_to,time_in_sec}=row
                    return {id,news_id,user_id,task,send_to,time_in_sec}
                }
            )
        })
    }catch(e){
        console.log(e)
        res.status(500).send({
            message:"Server Error"
        })
    }
})

module.exports=logRouter;