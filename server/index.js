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
        const bidsCollection = client.db('Open-hire').collection('bids');

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

        // Update a specific job
        app.put('/updateJob/:id', async (req, res) => {
            const { id } = req.params;
            const jobData = req.body;
            const updateJob = {
                $set: {
                    ...jobData
                }
            }
            const result = await jobsCollection.updateOne({ _id: new ObjectId(id) }, updateJob, { upsert: true });
            res.send(result)
        })

        /*  ********
        Bid related APIs Start
        **********/

        // Post a bid
        app.post('/add-bid', async (req, res) => {
            // Check whether exist twice
            console.log(req.body)
            const alreadyExist = await bidsCollection.findOne({
                jobId: req.body.jobId, bidder_email: req.body.
                    bidder_email
            });
            if (!!alreadyExist) {
                return res.status(409).send({ message: 'Already applied for the job' })
            }
            const query = { _id: new ObjectId(req.body.jobId) }
            const updateBidCount = {
                $inc: { bid_count: 1 }
            }

            const updateBid = await jobsCollection.updateOne(query, updateBidCount)

            res.send(await bidsCollection.insertOne(req.body))
        })



        // Get all bids a specific user made
        app.get('/my-bids/:email', async (req, res) => {
            const { email } = req.params;
            const query = { bidder_email: email };
            const result = await bidsCollection.find(query).toArray();
            res.send(result)
        })


        // Get all bid requests posted by all bidders
        app.get('/bid-requests/:email', async (req, res) => {
            const { email } = req.params;
            const query = { 'buyer.email': email };
            const result = await bidsCollection.find(query).toArray();
            res.send(result)
        })


        /*  ********
        Bid related APIs End
        **********/



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
