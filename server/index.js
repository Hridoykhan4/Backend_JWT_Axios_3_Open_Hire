const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: [`http://localhost:5173`],
    credentials: true
}

// MiddleWares
app.use(cors(corsOptions))
app.use(express.json());


const uri = `mongodb+srv://${process.env.OPEN_USER}:${process.env.OPEN_PASS}@liviing-hire-employer-e.qe99pmf.mongodb.net/?retryWrites=true&w=majority&appName=liviing-hire-employer-employees`;

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
        const jobsCollection = client.db('Open-hire').collection('jobs');

        // Get All Jobs
        app.get('/jobs', async (req, res) => {
            const result = await jobsCollection.find({}).toArray();
            res.send(result)
        })

        // Post a job
        app.post('/addJob', async (req, res) => {
            res.send(await jobsCollection.insertOne(req.body))
        })

        // Get a single Job for update/details page
        app.get('/job/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const result = await jobsCollection.findOne(query);
            res.send(result)
        })

        // Get specific posted jobs of an admin
        app.get('/posted-jobs/:email', async (req, res) => {
            const query = { 'buyer.email': req.params.email }
            const result = await jobsCollection.find(query).toArray();
            res.send(result)
        })

        // Delete a specific job
        app.delete('/job/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const result = await jobsCollection.deleteOne(query);
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("Open_Hire is running")
})

app.listen(port, () => {
    console.log(`Open is Onn...PORT: ${port}`)
})
