const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://yousuf:Lm8Z7rRr3yIm6BoG@school.ry74srq.mongodb.net/?retryWrites=true&w=majority&appName=school";

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
      console.log("MongoDB is connected");

      const database = client.db("UsersDB");
      const studentsCollection = database.collection("user");
      const noticesCollection = database.collection("notices");

      app.get("/", (req, res) => {
         res.send("Server is running...");
      });
      app.get("/users", async (req, res) => {
         try {
            const users = await studentsCollection.find({}).toArray();
            res.send(users);
         } catch (error) {
            console.log("api get a error::: ", error);
         }
      })

      app.post("/users", async (req, res) => {
         try {
            const apply = req.body;
            console.log('New student application:', apply);
            const result = await studentsCollection.insertOne(apply);
            res.send(result);
         } catch (err) {
            console.error('Post Error inserting application:', err);
            res.status(500).send({ error: 'An error occurred while processing the application.' });
         }
      });
      app.get("/notice", async (req, res) => {
         try {
            const notice = await noticesCollection.find({}).toArray();
            res.send(notice);
         } catch (error) {
            console.log("notice is not working:::", error);
         }
      })
      app.post("/notices", async (req, res) => {
         try {
            const newNotice = req.body;
            // You can add validation here
            console.log('New notice:', newNotice);
            const result = await noticesCollection.insertOne(newNotice);
            res.send(result);
         } catch (error) {
            console.error('POST Error inserting notice:', error);
            res.status(500).send({ error: 'An error occurred while processing the notice.' });
         }
      });

      app.delete("/users/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         try {
            const result = await studentsCollection.deleteOne(query);
            res.send(result);
         } catch (error) {
            console.log("delete method:::", error);
         }
      });
      app.put("/users/:id", async (req, res) => {
         const id = req.params.id;
         const updatedData = req.body;
         const query = { _id: new ObjectId(id) };
         const update = { $set: updatedData };
         try {
            const result = await studentsCollection.updateOne(query, update);
            res.send(result);
         } catch (error) {
            console.log("UPDATE method error:", error);
            res.status(500).send({ error: 'An error occurred while updating the student data.' });
         }
      });


      // Only start the server if the database connection is successful
      app.listen(port, () => {
         console.log(`Server is running at http://localhost:${port}`);
      });
   } catch (err) {
      console.error('Error connecting to MongoDB:', err);
   }
}



run().catch(console.error);