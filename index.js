const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://yousuf:Lm8Z7rRr3yIm6BoG@school.ry74srq.mongodb.net/?retryWrites=true&w=majority&appName=school";

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
    const blogCollection = database.collection("blogs");
    const teacherCollection = database.collection("teachers");
    const faqCollection = database.collection("faq");

    app.get("/", (req, res) => {
      res.send("Server is running...");
    });

    app.get("/users", async (req, res) => {
      try {
        const users = await studentsCollection.find({}).toArray();
        res.send(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res
          .status(500)
          .send({ error: "An error occurred while fetching users." });
      }
    });

    // get single data

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await studentsCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      try {
        const newUser = req.body;
        console.log("New student application:", newUser);
        const result = await studentsCollection.insertOne(newUser);
        res.send(result);
      } catch (error) {
        console.error("Error inserting user:", error);
        res
          .status(500)
          .send({ error: "An error occurred while processing the user." });
      }
    });

    app.get("/notices", async (req, res) => {
      try {
        const notices = await noticesCollection.find({}).toArray();
        res.send(notices);
      } catch (error) {
        console.error("Error fetching notices:", error);
        res
          .status(500)
          .send({ error: "An error occurred while fetching notices." });
      }
    });

    app.post("/notices", async (req, res) => {
      try {
        const newNotice = req.body;
        console.log("New notice:", newNotice);
        const result = await noticesCollection.insertOne(newNotice);
        res.send(result);
      } catch (error) {
        console.error("Error inserting notice:", error);
        res
          .status(500)
          .send({ error: "An error occurred while processing the notice." });
      }
    });

    app.get("/blog", async (req, res) => {
      try {
        const blogs = await blogCollection.find({}).toArray();
        res.send(blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        res
          .status(500)
          .send({ error: "An error occurred while fetching blogs." });
      }
    });

    app.post("/blog", async (req, res) => {
      try {
        const newBlog = req.body;
        console.log("New blog:", newBlog);
        const result = await blogCollection.insertOne(newBlog);
        res.send(result);
      } catch (error) {
        console.error("Error inserting blog:", error);
        res
          .status(500)
          .send({ error: "An error occurred while processing the blog." });
      }
    });

    app.get("/teachers", async (req, res) => {
      try {
        const teachers = await teacherCollection.find({}).toArray();
        res.send(teachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        res
          .status(500)
          .send({ error: "An error occurred while fetching teachers." });
      }
    });
    app.get("/faq", async (req, res) => {
      try {
        const faq = await faqCollection.find({}).toArray();
        res.send(faq);
      } catch (error) {
        console.log("faq server site get error:", error);
      }
    })
    app.post("/teachers", async (req, res) => {
      try {
        const newTeacher = req.body;
        console.log("New teacher:", newTeacher);
        const result = await teacherCollection.insertOne(newTeacher);
        res.send(result);
      } catch (error) {
        console.error("Error inserting teacher:", error);
        res
          .status(500)
          .send({ error: "An error occurred while processing the teacher." });
      }
    });

    app.post("/faq", async (req, res) => {
      try {
        const newFAQ = req.body;
        console.log('new faq: ', newFAQ);
        const result = await faqCollection.insertOne(newFAQ);
        res.send(result);
      } catch (error) {
        console.error("error faq server", error);
      }
    })

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await studentsCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting user:", error);
        res
          .status(500)
          .send({ error: "An error occurred while deleting the user." });
      }
    });
    app.delete("/faq/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await faqCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting FAQ:", error);
        res.status(500).send({ error: "An error occurred while deleting the FAQ." });
      }
    });

    app.delete("/teachers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      try {
        const result = await teacherCollection.deleteOne(query);
        console.log(result);
        if (result.deletedCount === 1) {
          res.send({ acknowledged: true });
        } else {
          res.status(404).send({ acknowledged: false, error: "Teacher not found" });
        }
      } catch (error) {
        console.error("Error deleting teacher:", error);
        res.status(500).send({ error: "An error occurred while deleting the teacher." });
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
        console.error("Error updating user:", error);
        res
          .status(500)
          .send({ error: "An error occurred while updating the user." });
      }
    });

    app.listen(port, () => {
      console.log(`"Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
}

run().catch(console.error);