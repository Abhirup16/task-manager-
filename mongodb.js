const mongodb = require('mongodb')
const mongodbClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

mongodbClient.connect(connectionURL, {useNewUrlParser: true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to database')
    }
    
    const db=client.db(databaseName)
    db.collection('tasks').insertMany([
        {
         description:'Go to walk',
         completed: true
     },{
         description:'do cp',
         completed: false
        },
        {
            description:'read',
            completed:true
        }
       ], (error,result)=>{
        if(error)
         return console.log('Unable to insert tasks')
        console.log(result)
    })
}) 