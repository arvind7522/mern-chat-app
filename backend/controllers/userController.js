import { User } from "../models/User.js";

const getUser =async(req, res) => {
  const users=await User.find().select("-password")
  res.send({message:"Hello Arvind this is the response from the server",users});
}

const userProfile=(req, res) => {
  res.send({ message: "Protected route accessed", user: req.user });
}

export {userProfile,getUser}