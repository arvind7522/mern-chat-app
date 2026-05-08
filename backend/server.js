import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authrouter from "./routes/authRoutes.js";
import messagerouter from "./routes/messageRoutes.js";
import userrouter from "./routes/userRoutes.js";

const app = express();

dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth",authrouter)
app.use("/api/message",messagerouter)
app.use("/",userrouter)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoDB is connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server started by arvind on ${PORT} `);
});
