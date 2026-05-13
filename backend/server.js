import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import authrouter from "./routes/authRoutes.js";
import messagerouter from "./routes/messageRoutes.js";
import userrouter from "./routes/userRoutes.js";

const app = express();
// create server
const server = http.createServer(app);

const io = new Server(server, {});

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("sendMessage", (data) => {
    const receiverSocketId = onlineUsers[data.receiverId];          // backend searches: onlineUsers["mongo999"] and gets socket id "socket777"(the user id and socket id mrntioned are just example)
    console.log("this is the reveiver id", receiverSocketId);
    io.to(receiverSocketId).emit("getMessage", {
      senderId: data.senderId,
      message: data.message,        
    });
  });
  socket.on("disconnect", () => {
    console.log(socket.id);
  });
  socket.on("addUser", (userId) => {
    onlineUsers[userId] = socket.id;      // STORE USER + SOCKET RELATION- backend now know which socket belongs to which user 
    socket.on("disconnect", () => {
      delete onlineUsers[userId];
    });
  });
});

dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", authrouter);
app.use("/api/message", messagerouter);
app.use("/api", userrouter);                              // there is a mistake here, need to "use /api" instead of just ""

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoDB is connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server started by arvind on ${PORT} `);
});
