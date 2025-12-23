const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

// Generate a unique, order-independent room id for a user pair
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId.toString(), targetUserId.toString()].sort().join("_"))
    .digest("hex");
};

const initialiseSocket = (server) => {
  const defaultOrigins = [
    "http://localhost:5173",
    "https://techtribe-web.onrender.com",
  ];
  const allowedOrigins = (process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : defaultOrigins
  ).map((o) => o.trim());

  const io = socket(server, {
    cors: {
      origin: allowedOrigins,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joining Room: " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(
            `${firstName} sending message to Room: ${roomId} - ${text}`
          );

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();

          io.to(roomId).emit("receiveMessage", {
            firstName,
            userId,
            targetUserId,
            text,
          });
        } catch (error) {
          console.error(error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initialiseSocket;
