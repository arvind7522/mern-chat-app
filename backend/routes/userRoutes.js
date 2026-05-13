import express from "express";
const userrouter=express.Router()
import protect from "../middleware/authMiddleware.js";
import {userProfile,getUser} from "../controllers/userController.js"

// get users
userrouter.get("/",getUser);

// user profile
userrouter.get("/user/profile", protect,userProfile);

export default userrouter
