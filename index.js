const express = require('express')
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7xouwts.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffe = client.db('coffeDb').collection('coffe')
    const userCollection = client.db('coffeDb').collection('user')
    //read operation
    app.get('/coffe', async(req,res)=>{
        const cursor = coffe.find()
        const result = await cursor.toArray() 
        res.send(result)
    })
    app.get('/coffe/:id', async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await coffe.findOne(query)
        res.send(result)
        
    })
    //insert operation
    app.post('/coffe', async(req,res)=>{
        const result = await coffe.insertOne(req.body)
        res.send(result)
    })
//delete operation
    app.delete('/coffe/:id', async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await coffe.deleteOne(query)
        res.send(result)
    })
    // update operation
    app.put('/coffe/:id', async(req,res)=>{
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true }
        const updatedCoffe = req.body
        const coffeeDoc = {
            $set: {
                name:updatedCoffe.name,
                quantity:updatedCoffe.quantity,
                supplier:updatedCoffe.supplier,
                categoryaa:updatedCoffe.category,
                details:updatedCoffe.details,
                taste:updatedCoffe.taste,
                photo:updatedCoffe.photo
            },
          };
          const result = await coffe.updateOne(filter,coffeeDoc,options)
          res.send(result)
    })
    //coffe user apis
    app.post('/user',async(req,res)=>{
        const result = await userCollection.insertOne(req.body)
        res.send(result)
    })

    //get all users

    app.get('/users',async(req,res)=>{
        const cursor = userCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    //delete users
    app.delete('/users/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)
    })

    //update user
    app.patch('/users/',async(req,res)=>{
        const email = req.body.email
        const filter = {email:email}
        const updateUserDoc ={
           $set:{
            lastSignIn:req.body.lastLoggedAt
           }
        }
        const result =await userCollection.updateOne(filter,updateUserDoc)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Coffe making server is running')
})

app.listen(port,()=>{
    console.log(`app is running on port ${port}`)
})
