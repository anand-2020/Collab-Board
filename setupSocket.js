const socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const Board = require("./models/boardModel");

module.exports.setupSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      console.log("Authorizing socket....");
      socket.decoded = jwt.verify(
        socket.handshake.query.token,
        process.env.JWT_SECRET
      );
      next();
    } catch (err) {
      console.log("Could not authorize for this board");
      next(new Error("Could not authorize for this board"));
    }
  }).on("connection", async (socket) => {
    const board = await Board.findById(socket.decoded.id);
    if (!board)
      return io.emit("error", {
        msg: "Oops.. An unexpected error occured. Try reloading",
      });

    const roomID = socket.decoded.id;
    socket.join(roomID);

    io.emit("connected");
    console.log("Socket connection established");

    socket.on("update-canvas", (data) => {
      socket.broadcast.to(roomID).emit("update-canvas", data);
    });
  });
};
