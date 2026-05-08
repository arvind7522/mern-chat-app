import express from "express";
import {userRegistration,userLogin} from "../controllers/authController.js"
const authrouter=express.Router();


authrouter.post("/register",userRegistration);

authrouter.post("/login",userLogin);

export default authrouter