const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const Board = require("./models/boardModel");

const roomAuth = async (userID, boardID) => {
  if (userID) {
    try {
      const board = await Board.findById(boardID).select("owner collaborators");

      let found = false;
      if (board.owner === userID) found = true;
      else {
        for (var i = 0; i < board.collaborators.length; i++) {
          if (board.collaborators[i] === userID) {
            found = true;
            break;
          }
        }
      }
      if (found) return true;
      else return false;
    } catch (err) {
      return false;
    }
  } else {
    try {
      const board = await Board.findById(boardID).select("isPublic");
      if (board.isPublic) return true;
      else return false;
    } catch (err) {
      return false;
    }
  }
};

module.exports.setupSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    if (socket.handshake.query.token) {
      try {
        socket.decoded = jwt.verify(
          socket.handshake.query.token,
          process.env.JWT_SECRET
        );
        next();
      } catch (err) {
        console.log("Could not authorize for this board");
        next(new Error("Could not authorize for this board"));
      }
    } else {
      socket.decoded = { id: null };
      next();
    }
  }).on("connection", async (socket) => {
    const userID = socket.decoded.id;
    console.log("socket connected");
    io.emit("connected");

    let roomID = null;

    socket.on("disconnect", () => console.log("socket disconnected"));

    socket.on("join-room", async (boardID) => {
      try {
        const canJoin = await roomAuth(userID, boardID);

        if (canJoin) {
          roomID = boardID;
          socket.join(roomID);
          console.log("Room joined");
          io.emit("room-joined");
        } else {
          console.log("unauthorized");
          io.emit("auth-error");
        }
      } catch (err) {
        console.log("unauthorized");
        io.emit("auth-error");
      }
    });

    socket.on("leave-room", async (boardID) => {
      try {
        const canLeave = await roomAuth(userID, boardID);

        if (canLeave) {
          socket.leave(roomID);
          roomID = null;
          console.log("Room left");
        } else {
          console.log("Could not leave");
        }
      } catch (err) {
        console.log("Could not leave");
      }
    });

    socket.on("update-canvas", async (data) => {
      socket.broadcast.to(roomID).emit("update-canvas", data);
    });
  });
};
