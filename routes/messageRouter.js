const express=require('express');
const dbClient=require('../db/postgres')
const {v4:uuidv4}=require('uuid');


messageRouter=express.Router()

messageRouter.post('/msg',async(req,res)=>{
    const {send_by,send_to}=req.body

    const queryText='select news.news_id as news_id,news.author as author,news.headline as headline,news.info as info,news.image_link as image_link from news inner join message on news.news_id=message.fk_news_id and message.send_by=$1 and message.send_to=$2;'
    const queryValues=[send_by,send_to]

    try{
        await dbClient.connect()

        const result=await dbClient.query(queryText,queryValues)

        if(result.rowCount==0){
            res.status(200).send()
        }

        res.status(200).send({
            message:Array.from(
                result.rows,(row)=>{
                    const {news_id,author,image_link,headline,info}=row
                    return {news_id,author,image_link,headline,info}
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

messageRouter.post('/',async(req,res)=>{
    const id=uuidv4()

    const {fk_news_id,send_to,send_by}=req.body

    const queryText='insert into message(id,fk_news_id,send_to,send_by) values($1,$2,$3,$4);'
    const queryValues=[id,fk_news_id,send_to,send_by]

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

module.exports=messageRouter