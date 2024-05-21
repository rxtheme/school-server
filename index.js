const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// const uri = "mongodb+srv://schoolTeam:Rltdkf8lwJ3sTcUf@school.ry74srq.mongodb.net/?retryWrites=true&w=majority&appName=school";


const uri = "mongodb+srv://forSchool:5DCnA4NQvH2DZX2V@cluster0.mtbweb5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      await client.connect();
      console.log("mongodb is connecting");
      const db = client.db("StudentsDB");
      const StudentsCollection = db.collection("students");

      app.get("/", (req, res) => {
         res.send("Server is running...");
      });

      app.get("/application", async (req, res) => {
         try {
            const result = await StudentsCollection.find({}).toArray();
            res.send(result);
         } catch (error) {
            console.log('new error from apply route::: ', error);
         }
      });

      app.post("/application", async (req, res) => {
         try {
            const apply = req.body;
            const result = await StudentsCollection.insertOne(apply);
            console.log("insertOne apply data:::", result);
            res.send(result);

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
