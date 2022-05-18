const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//----------------------------------------------
app.use(cors());
app.use(express.json());

//----------------------------------------------
const uri =
  "mongodb+srv://todolist:0AdHTSXOyvZuLFFv@cluster0.syv7x.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//----------------------------------------------
async function run() {
  try {
    await client.connect();
    const TaskCollection = client.db("TO-DO-List").collection("Tasks");

    // get api to read all Task
    //http://localhost:5000/Tasks
    app.get("/Tasks", async (req, res) => {
      const query = req.query;
      const cursor = TaskCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //create Task
    // {
    //     "_id": "62854864af2ae00967627cc6",
    //     "taskName": "name",
    //     "taskDescription": "description"
    // }
    //http://localhost:5000/Task
    app.post("/Task", async (req, res) => {
      const data = req.body;
      const result = await TaskCollection.insertOne(data);
      res.send(result);
    });

    // delete Task
    //http://localhost:5000/Task/6262dcd73f629a282aaba2e6
    app.delete("/Task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };

      const result = await TaskCollection.deleteOne(filter);

      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);
//----------------------------------------------
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//----------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
