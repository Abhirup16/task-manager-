const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt = require('bcrypt')
const task = require('./tasks')
const jwt = require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim: true
    },
    age: {
        type:Number,
        validate(value){
            if(value<=0)
              throw new Error('Invalid age')
        }

    },
    email: {
        type:String,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
              throw new Error('Enter a valid email!!')
        }
    },
    password: {
        type: String,
        required:true,
        trim:true,
        validate(value)
        {
            if(value.length<=6)
              throw new Error('Must be more than 6 char lenght')
            if(value.includes('password'))
              throw new Error('cant contain password in it')
        }
    },
    tokens:[{
            token:{
                type:String,
                required:true,
            }
    }],
    avatar:{
        type:Buffer
    }
},{timestamps:true})
userSchema.methods.generateAuthToken=async function(){
    const token = jwt.sign({_id:this._id.toString()},'signthisplease')
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}
userSchema.statics.findByCredentials = async (email,password)=>{
    const users = await user.findOne({email})
    if(!users)
      throw new Error ('Unable to Login')
    const isMatch = await bcrypt.compare(password,users.password)
    if(!isMatch)
       throw new Error('Unable to Login')
    return users
}
userSchema.pre('save',async function(next) {
    if(this.isModified('password'))
      this.password=await bcrypt.hash(this.password,8)
    next()
})
userSchema.pre('remove',async function(next){
    const user = this
    await task.deleteMany({owner:this._id})
    next()
})
const user = mongoose.model('Users',userSchema)
module.exports=user
