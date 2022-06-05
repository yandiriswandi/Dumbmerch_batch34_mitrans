// import models
const { chat, user, profile } = require("../../models");
// import jsonwebtoken
const jwt = require("jsonwebtoken");

// import sequelize operator
// https://sequelize.org/master/manual/model-querying-basics.html#operators
const { Op } = require("sequelize");

const connectedUser = {};

// on = penerima informasi/event  
// emmit = pengirim informasi
const socketIo = (io) => {
  // create middlewares to prevent client without token to access socket server
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      //pengisian token dari fe berdasarkan localstorage
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });

  io.on("connection", async (socket) => {//on untuk menerima printah sama seprti type di userContext fe
    console.log("client connect: ", socket.id);//id perbeda tiap client

    // get user by connected id
    const userId = socket.handshake.query.id;//query dari FE

    // save to connectedUser
    connectedUser[userId] = socket.id;

    // admin contact
    socket.on("load admin contact", async () => {
      try {
        const adminContact = await user.findOne({
          include: [
            {
              model: profile,
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          where: {
            status: "admin",
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });

        socket.emit("admin contact", adminContact);
      } catch (err) {
        console.log(err);
      }
    });

    // customer contact
    socket.on("load customer contacts", async () => {
      try {
        let customerContacts = await user.findAll({
          include: [
            {
              model: profile,
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: chat,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
            {
              model: chat,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });

        customerContacts = JSON.parse(JSON.stringify(customerContacts));
        customerContacts = customerContacts.map((item) => ({
          ...item,
          profile: {
            ...item.profile,
            image: item.profile?.image
              ? process.env.PATH_FILE + item.profile?.image
              : null,
          },
        }));

        socket.emit("customer contacts", customerContacts); //emmit for send
      } catch (err) {
        console.log(err);
      }
    });

    // define listener on event load messages
    socket.on("load messages", async (payload) => { // on for receieve
      console.log("load messages", payload);
      try {
        const token = socket.handshake.auth.token;

        const tokenKey = process.env.TOKEN_KEY;
        const verified = jwt.verify(token, tokenKey);

        const idRecipient = payload; // catch recipient id sent from client
        const idSender = verified.id; //id user

        const data = await chat.findAll({
          where: {
            idSender: {
              [Op.or]: [idRecipient, idSender],
            },
            idRecipient: {
              [Op.or]: [idRecipient, idSender],
            },
          },
          include: [
            {
              model: user,
              as: "recipient",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
            {
              model: user,
              as: "sender",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
          ],
          order: [["createdAt", "ASC"]],//ascending dari terbesar atau terbaru message
          attributes: {
            exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
          },
        });

        socket.emit("messages", data);
      } catch (error) {
        console.log(error);
      }
    });

    // define listener on event send message
    socket.on("send message", async (payload) => {
      try {
        const token = socket.handshake.auth.token;

        const tokenKey = process.env.TOKEN_KEY;
        const verified = jwt.verify(token, tokenKey);

        const idSender = verified.id; //id user
        const { message, idRecipient } = payload; // catch recipient id and message sent from client

        await chat.create({
          message,
          idRecipient,
          idSender,
        });

        // emit to just sender and recipient default rooms by their socket id
        io.to(socket.id)
          .to(connectedUser[idRecipient])
          .emit("new message", idRecipient);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id);
      delete connectedUser[userId];
    });
  });
};

module.exports = socketIo;
