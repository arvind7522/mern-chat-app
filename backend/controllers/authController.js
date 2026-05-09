import bcrypt, { hash } from "bcryptjs";
import {User} from "../models/User.js"
import jwt from "jsonwebtoken"


const userRegistration = async (req, res) => {
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
};

const userLogin = async (req, res) => {
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
};


export {userRegistration, userLogin}