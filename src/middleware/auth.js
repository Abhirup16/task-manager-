const res = require("express/lib/response")
const user = require("../models/user")
const jwt = require('jsonwebtoken')
const auth = async (req,res)=>{
    try{
    const token = req.header('Authorization').replace('Bearer ','')
    const decoded =  jwt.verify(token,'signthisplease')
    const users = await user.findOne({_id:decoded._id, 'tokens.token':token})
    if(!users){
        throw new Error()
    }
    req.token = token
    req.user = users
    next()
}catch(e){
    res.status(400).send({error:'Token is either malformed, missing or expired'})
}
}

module.exports=auth