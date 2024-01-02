import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const start = async () => {
  const client = await MongoClient.connect(
    "mongodb://localhost:27017/fsr-todos",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );
  const db = client.db("fsr-todos");

  const app = express();
  app.use(express.json());

  app.get("/todos", async (req, res) => {
    const todos = await db.collection("todos").find({}).toArray();
    res.json(todos);
  });

  app.post("/todos", async (req, res) => {
    const newTodoText = req.body.newTodoText;
    const newTodo = {
      text: newTodoText,
      isCompleted: false,
    };
    const result = await db.collection("todos").insertOne(newTodo);
    res.json({ ...newTodo, _id: result.insertedId });
  });

  app.delete("/todos/:todoId", async (req, res) => {
    const todoId = req.params.todoId;
    await db.collection("todos").deleteOne({ _id: new ObjectId(todoId) });
    const todos = await db.collection("todos").find({}).toArray();
    res.json(todos);
  });

  app.put("/todos/:todoId", async (req, res) => {
    const todoId = req.params.todoId;
    await db.collection("todos").updateOne(
      { _id: new ObjectId(todoId) },
      {
        $set: { isCompleted: true },
      },
    );

    const todos = await db.collection("todos").find({}).toArray();
    res.json(todos);
  });

  app.listen(8080, () => {
    console.log("Sever is listening on port 8080");
  });
};

start();
