import {Message} from "../models/Message.js";

const sendMessage = async (req, res) => {
  try {
    // sender from logged in user
    const sender = req.user.id;

    // receiver(comes from the front-end)
    const { receiver, message } = req.body;

    // create the message
    const newMessage = await Message.create({
      sender,
      receiver,
      message,
    });
    return res.status(200).send(newMessage);
  } catch (error) {
    return res.status(500).send({
      message: "message sending failed",
      error: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  const receiver = req.params.id;

  // sender details
  const sender = req.user.id;

  const message = await Message.find({
    $or: [
      { sender: sender, receiver: receiver },
      { sender: receiver, receiver: sender },
    ],
  });
  return res.status(200).send(message);
};

export { sendMessage, getMessages };

// // sample_mflix
// app.get("/sample/anydata", async (req, res) => {
//   const dataBase = mongoose.connection.client.db("sample_mflix");
//   const movies = await dataBase
//     .collection("movies")
//     .find({})
//     .limit(100)
//     .toArray();
//   console.log("movies", movies);

//   res.status(200).send("Movies data had received");
// });
