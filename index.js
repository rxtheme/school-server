const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
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
            console.log("API GET error:", error);
            res.status(500).send({ error: 'An error occurred while fetching users.' });
         }
      });

      app.post("/users", async (req, res) => {
         try {
            const newStudent = req.body;
            // Generate unique 6-character ID
            let uniqueId = generateUniqueId();
            // Check uniqueness
            while (await studentsCollection.findOne({ customId: uniqueId })) {
               uniqueId = generateUniqueId();
            }
            // Add the custom ID to the new student data
            newStudent.customId = uniqueId;
            console.log('New student application:', newStudent);
            const result = await studentsCollection.insertOne(newStudent);
            res.send(result);
         } catch (error) {
            console.error('POST Error inserting application:', error);
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

      // Utility function to generate unique ID with 6 characters
      function generateUniqueId() {
         const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
         let result = '';
         for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
         }
         return result;
      }

      // Other routes...

      app.listen(port, () => {
         console.log(`Server is running at http://localhost:${port}`);
      });
   } catch (err) {
      console.error('Error connecting to MongoDB:', err);
   }
}

run().catch(console.error);
