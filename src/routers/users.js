const express = require("express");
const router = express.Router()
const sharp = require('sharp')
const user = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const {sendWelcomeEmail,sendCancelationEmail}=require('../emails/account')

const upload = multer({
    limits:{
    filesize:1000000
},
fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('Please upload an image'))
    }
    cb(undefined,true)
   }
})
router.post('/user',async (req,res)=>{
    const obj = new user(req.body)
    try{
        await obj.save()
        res.status(201).send(obj)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/user/me',auth,async (req,res)=>{
    res.status(200).send(req.user)
})

router.delete('/user/me',auth, async(req,res)=>
{
    try{
        // const user = await user.findByIdAndDelete(req.user._id)
        // if(!user)
        //   return res.status(404).send(user) 
        await sendCancelationEmail(req.user.email,req.user.name)
        await req.user.remove()
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

//routner.post('/user/login',async)
router.post('/user/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
     const buffer = await sharp(req.body.buffer).resize({width:250,height:25}).png().toBuffer()
     req.user.avatar=buffer
     await req.user.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/user/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    req.send()
})

router.patch('/user/me',auth,async (req,res)=>
{
    console.log("hello")
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValidUpdate = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidUpdate)
      return res.status(400).send({error: 'Invalid updates!'})

    try{    
        const result = req.user
        updates.forEach((update)=>result[update]=req.body[update])
        await result.save()
        // if(!result)
        //   return res.status(404).send()
        res.status(201).send(result)

    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/user/login',async(req,res)=>{
    try{
    const result = await user.findByCredentials(req.body.email,req.body.password)
    const token = await result.generateAuthToken()
    res.status(200).send(result)
    }catch(e){
       res.status(500).send(e)
    }
})
router.post('/user/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
    }catch(e){
        res.status(400).send(e)
    }
})
router.post('/user/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
    }catch(e){
        res.status(400).send(e)
    }
})
module.exports=router