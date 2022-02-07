const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const task = require('../models/tasks')
const user = require('../models/user')

router.get('/task',auth,async(req,res)=>{
    try{
        const match =  { }
        if(req.query.completed){
            match.completed = req.query.completed==='true'
        }
        const tasks = task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).exexPopulate()
        res.send(req.user.tasks)
    }catch(e){

    }
})
router.post('/task',auth, async (req,res)=>{
    const obj = new task(req.body)
    try{

        await obj.save()
        res.status(201).send(obj)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/task/:id',auth, async (req,res)=>{
    try{
        result = await task.findOne({_id:req.params.id,owner:req.user._id})
        if(!result)
          return res.status(404).send(result)
        res.status(200).send(result)
    }catch(e){
        res.status(500).send(e)
    }
})


router.patch('/task/:id',async (req,res)=>
{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['desction','completed']
    const isValidUpdate = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidUpdate)
      return res.status(400).send({error: 'Invalid updates!'})
    try{
        const tasks = await  task.findOne({_id:req.params.id,owner:req.user._id})
        if(!tasks)
         return req.status(404).send()
        updates.forEach((update)=>tasks[update]=req.body[update])
        await tasks.save()
        req.status(201).send(tasks)
    }catch(e){
        res.status(400).send(e)
    }
})
router.get('/task',async(req,res)=>{
    const tasks = await task.find({})
    if(!tasks)
      return res.status(404).send(tasks)
    res.status(200).send(tasks)
})
router.delete('/tasks/:id',auth,async(req,res)=>{
   try{
        await task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        req.status(200).send()
   }catch(e){
         req.status(400).send(e)
   } 
})
module.exports = router

