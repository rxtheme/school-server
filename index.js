const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://schoolTeam:Rltdkf8lwJ3sTcUf@school.ry74srq.mongodb.net/?retryWrites=true&w=majority&appName=school";

const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server
      await client.connect();
      const db = client.db("SchoolDB");
      const collection = db.collection("schoolApplies"); // Consistent collection name

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

      // Define the insertOne function for the collection
      async function insertApplyRequest(applyRequest) {
         const result = await collection.insertOne(applyRequest);
         return result;
      }
      app.get("/apply", async (req, res) => {
         try {
            const result = await collection.findOne({}).toArray();
            res.send(result);
         } catch (error) {
            console.log('new error from apply route::: ', error);
         }
      });
      async function retrieveApplications() {
         try {
            const cursor = collection.find({});
            const applications = await cursor.toArray();
            return applications;
         } catch (error) {
            console.error("Error retrieving applications:", error);
            return []; // Or throw an appropriate error for the client
         }
      }

      app.get("/apply", async (req, res) => {
         try {
            const applications = await retrieveApplications();
            res.send(applications);
         } catch (error) {
            res.status(500).send("Error retrieving applications");
         }
      });

   } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
   }
}

run().catch(console.error);

app.listen(port, () => {
   console.log(`http://localhost:${port}`);
});
