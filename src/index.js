const express = require('express')
const user = require('./models/user')
const task = require('./models/tasks')

require('./db/mongoose')
const userRouter = require('./routers/users')
const taskRouter = require('./routers/tasks')
const multer = require('multer')
const app=express()
const port = process.env.port
app.use(express.json())
// app.use((req,res)=>{
//     res.status(503).send("Under maintanence bruh")
//     next()
// })
app.use(userRouter)
app.use(taskRouter)

const upload = multer({
    dest:'images'
})
app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
    
})
app.listen(port,()=>{
    console.log('Server has started on port '+ port)
})

