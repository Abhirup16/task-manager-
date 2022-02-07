const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        trim: true,
        required:true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'user'
    }
},{timestamps:true})
const task = mongoose.model('Tasks',taskSchema)
module.exports=task





