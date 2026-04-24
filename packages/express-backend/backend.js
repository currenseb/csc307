import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userServices from "./models/user-services.js";

const app = express();
const port = 8000; // set the port so its consistent thorughout runs

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
});

// New fucntions all now using mongo db

const findUserByName = (name) => {
  return userServices.findUserByName(name);
};

const findUserByJob = (job) => {
  return userServices.findUserByJob(job);
};

const findUserByNameAndJob = (name, job) => {
  return userServices.findUserByNameAndJob(name, job);
};

const findUserById = (id) => {
  return userServices.findUserById(id);
};

const deleteUserById = (id) => {
  return userServices.deleteUserById(id);
};

const addUser = (user) => {
  return userServices.addUser(user);
};

app.get("/users", async (req, res) => {
  try {
    const name = req.query.name;
    const job = req.query.job;
    const result = await userServices.getUsers(name, job);
    res.send({ users_list: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
  const id = req.params["id"]; //or req.params.id
  const result = await findUserById(id);
  if (result === null) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(404).send("Resource not found.");
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params["id"];
    const deletedUser = await deleteUserById(id);
    if (deletedUser === null) {
      res.status(404).send("Resource not found.");
    } else {
      res.status(204).send();
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(404).send("Resource not found.");
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post("/users", async (req, res) => {
  try {
  const userToAdd = req.body;
  const newUser = await addUser(userToAdd);
  res.status(201).send(newUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});
