const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2fh4pkj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db('tourTrekkerDB').collection('user');
    const touristSpotCollection = client
      .db('tourTrekkerDB')
      .collection('touristsSpot');

    app.get('/touristsSpot', async (req, res) => {
      const cursor = touristSpotCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/allTouristsSpot', async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/allTouristsSpot/:id', async (req, res) => {
      const id = req.params.id;
      console.log(req.params);
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });

    app.delete('/allTouristsSpot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result);
    });
    app.patch('/allTouristsSpot/:id', async (req, res) => {
      const updatedData = req.body;
      console.log(updatedData);
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          photo: updatedData.photo,
          spot_name: updatedData.spot_name,
          country_name: updatedData.country_name,
          location: updatedData.location,
          description: updatedData.description,
          cost: updatedData.cost,
          seasonality: updatedData.seasonality,
          travel_time: updatedData.travel_time,
          visitors: updatedData.visitors,
        },
      };
      const result = await touristSpotCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.post('/touristsSpot', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await touristSpotCollection.insertOne(user);
      res.send(result);
    });

    app.get('/myList/:email', async (req, res) => {
      const email = req.params.email;
      const result = await touristSpotCollection
        .find({ email: email })
        .toArray();
      res.send(result);
    });

    // app.delete('/myList/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await touristSpotCollection.deleteOne(query);
    //   res.send(result);
    // });

    app.post('/user', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Tour Trekker server in running');
});

app.listen(port, () => {
  console.log('Server is running on:', port);
});
