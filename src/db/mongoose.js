const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')




// const me = new user({name: 'Light', age: 22})
// me.save().then(()=>{
//   console.log(me)
// }).catch((error) => {console.log(error)})

// const you = new user({name: 'Misa', age: 'yes'})
// you.save().then(()=>{
//     console.log(you)
// }).catch((error)=>{
//     console.log(error)
// })

// const obj = new user({name:'Flightdd', age:20, email:'uolohe@gmai.com', password:'password123'})
// obj.save().then(()=>{
//     console.log(obj)
// }).catch((error)=> {console.log(error)})
