const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// MiddleWares
app.use(cors())
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
