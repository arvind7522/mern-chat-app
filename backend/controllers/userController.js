import {User} from "../models/User.js"

const getUser =(req, res) => {
  res.send("Hello Arvind this is the response from the server");
}

const userProfile=(req, res) => {
  res.send({ message: "Protected route accessed", user: req.user });
}

export {userProfile,getUser}