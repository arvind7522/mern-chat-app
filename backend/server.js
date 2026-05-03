import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Arvind this is the response from the server");
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).send("user already exist");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      return res.status(201).send(user);
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "user register successfully", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("user not found");
    }

    // compare password
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(200).send("enter the valid credentials");
    }

    // create the jsonwebToken
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .send({ message: "user logged in sucessfully", token: token });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "login error", error: error.message });
  }
});

// sample_mflix
app.get("/sample/anydata", async (req, res) => {
  const dataBase = mongoose.connection.client.db("sample_mflix");
  const movies = await dataBase
    .collection("movies")
    .find({})
    .limit(100)
    .toArray();
  console.log("movies", movies);

  res.status(200).send("Movies data had received");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoDB is connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server started by arvind on ${PORT} `);
});
