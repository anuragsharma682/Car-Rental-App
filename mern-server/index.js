const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const cors=require('cors');

//middleware
app.use(cors());
app.use(express.json());

//Ith4jCKxBbC1W9Vz



app.get('/', (req, res) => {
  res.send('Hello World!')
})

//mongodb configuration 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Mern-Car:Ith4jCKxBbC1W9Vz@cluster0.t1j91es.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    //create a coolection for the database
    const carCollections=client.db("CarsInventory").collection("cars");

    // insert a car to the database method
    app.post("/upload-car",async(req,res)=>{
        const data=req.body;
        const result=await carCollections.insertOne(data);
        res.send(result);
    })

    // get all cars from db
    app.get("/all-cars",async(req,res)=>{
      const cars= carCollections.find();
      const result=await cars.toArray();
      res.send(result);
    })

    //update a car data:patch or update method
    app.patch("/car/:id",async(req,res)=>{
      const id=req.params.id;
      //console.log(id);
      const updateCarData=req.body;
      const filter={_id: new ObjectId(id)};
      const options={upsert:true};
      const updateDoc={
        $set:{
          ...updateCarData
        }
      }
      //update
      const result=await carCollections.updateOne(filter,updateDoc,options);
      res.send(result);
    })

    //delete a car data
    app.delete("/car/:id",async(req,res)=>{
      const id=req.params.id;
      const filter={_id: new ObjectId(id)};
      const result=await carCollections.deleteOne(filter);
      res.send(result);
    })

    //find by category
    app.get("/all-cars",async(req,res)=>{
      let query={};
      if(req.query?.category){
          query={category:req.query.category}
      }
      const result=await carCollections.find(query).toArray();
      res.send(result);
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})