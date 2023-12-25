const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://phoneApi:G7uYqBZKOaGJF0it@cluster0.f3op28d.mongodb.net/?retryWrites=true&w=majority";

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
    // await client.connect();

    const phoneCollection = client.db("PhoneUniverse").collection("Phone");

    app.get("/api/v1/phones", async (req, res) => {
      const filters = req.query;
      console.log(filters);

      // Construct the query based on filters
      const query = {};
      if (filters.brand) query.brand = filters.brand;
      if (filters.price) query.price = { $lte: parseFloat(filters.price) };
      if (filters.type) query.type = filters.type;
      if (filters.ram) query["memory.ram"] = parseInt(filters.ram);
      if (filters.processor_type) query.processor_type = filters.processor_type;
      if (filters.os_type) query.os_type = filters.os_type;
      const result = await phoneCollection.find(query).toArray();
      res.send(result);
      console.log(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
