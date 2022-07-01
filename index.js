const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1gw7m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const tasksCollection = await client
      .db("google-task")
      .collection("toDoList");
    const completedCollection = await client
      .db("google-task")
      .collection("completed");

    app.post("/toDoList", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send(result);
    });

    app.get("/toDoList", async (req, res) => {
      const result = await tasksCollection.find({}).toArray();
      res.send(result);
    });

    app.post("/completed", async (req, res) => {
      const task = req.body;
      const result = await completedCollection.insertOne(task);
      res.send(result);
    });

    app.delete("/toDoList", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.deleteOne(task);
      res.send(result);
    });
    app.put("/toDoList ", async (req, res) => {
        const id = req.params.id;
        const list = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            task : list.task,
          },
        };
        
        
        const result = tasksCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    });
    app.delete("/completed", async (req, res) => {
      const task = req.body;
      const result = await completedCollection.deleteOne(task);
      res.send(result);
    });

    app.get("/completed", async (req, res) => {
      const result = await completedCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Power-Hack is running ");
});

app.listen(port, () => {
  console.log(`Server is running on port`, port);
});
