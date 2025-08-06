const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: [`http://localhost:5173`],
    credentials: true
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};


// MiddleWares
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
// Custom verify token
const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: "Unauthorized Access" })
    }
    jwt.verify(token, process.env.OPEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized Access" })
        }
        req.user = decoded;
        next()
    })
}


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


        /* ****** JWT Related APIs Start  */
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.OPEN_SECRET, { expiresIn: '10d' });
            res.cookie('token', token, cookieOptions).send({ success: true })
        })


        app.get('/logout', (req, res) => {
            res.clearCookie('token', process.env.OPEN_SECRET, { ...cookieOptions, maxAge: 0 }).send({ success: true })
        })


        /* ****** JWT Related APIs End  */

        // Get All Jobs
        app.get('/jobs', async (req, res) => {
            const { filter, search, sort } = req.query;
            let query = {}
            if (filter) {
                query = { category: filter }
            }
            if (search) {
                query = { job_title: { $regex: search, $options: "i" } }
            }

            let cursor = jobsCollection.find(query);
            if (sort === 'asc') {
                cursor = cursor.sort({ deadline: 1 })
            }
            else if (sort === "dsc") {
                cursor = cursor.sort({ deadline: -1 })
            }

            const result = await cursor.toArray();
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
        /* *********** */
        /* *********** */
        /* *********** */
        app.get('/my-bids/:email', verifyToken, async (req, res) => {
            const { email } = req.params;
            if (req.user?.email !== email) {
                return res.status(403).send({ message: "Forbidden Access" })
            }
            const query = { bidder_email: email };
            const result = await bidsCollection.find(query).toArray();
            res.send(result)
        })


        // Get all bid requests posted by all bidders
        app.get('/bid-requests/:email', verifyToken, async (req, res) => {
            const { email } = req.params;
            if (req.user?.email !== email) {
                return res.status(403).send({ message: "Forbidden Access" })
            }
            const query = { 'buyer.email': email };
            const result = await bidsCollection.find(query).toArray();
            res.send(result)
        })

        // Update Status
        app.patch('/update-status/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: new ObjectId(id) };
            const status = req.body
            const updateStatus = {
                $set: status
            }
            const result = await bidsCollection.updateOne(query, updateStatus);
            res.send(result);
        })


        /*  ********
        Bid related APIs End
        **********/

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
