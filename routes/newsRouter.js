const express=require('express');
const dbClient=require('../db/postgres')
const {v4:uuidv4}=require('uuid');

newsRouter=express.Router()

newsRouter.get('/',async(req,res)=>{

    const queryText='select * from news;'
    const queryValues=[]

    try{
        await dbClient.connect()

        const result=await dbClient.query(queryText,queryValues)

        res.status(200).send({
            message:Array.from(
                result.rows,(row)=>{
                    const {news_id,author,image_link,headline,info,description}=row
                    return {news_id,author,image_link,headline,info,description}
                }
            )
        })
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

newsRouter.post('/',async(req,res)=>{
    const id=uuidv4()
    const {author,image_link,headline,info,description}=req.body

    const queryText='insert into news(news_id,author,image_link,headline,info,description) values($1,$2,$3,$4,$5);'
    const queryValues=[id,author,image_link,headline,info,description]

    var client
    try{
        client=await dbClient.connect()
        await client.query('BEGIN')

        const result=await client.query(queryText,queryValues)
        await client.query('COMMIT')

        res.status(200).send({message:"Success"})
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

module.exports=newsRouter