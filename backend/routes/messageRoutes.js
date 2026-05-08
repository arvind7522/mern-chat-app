import express from "express";
const messagerouter = express.Router();
import protect from "../middleware/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

// sender handling
messagerouter.post("/send", protect,sendMessage);

// receiver handling
messagerouter.get("/:id", protect,getMessages);

export default messagerouter
