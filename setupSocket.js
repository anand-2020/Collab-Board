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

  io.on("connection", async socket => {

    console.log("socket connected")
    io.emit('connected')

    socket.on("join-room", token => {

      try {
        console.log("joining room")
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        socket.join(decoded.id)
        io.emit('room-joined')

      } catch (err) {

        console.log('unauthorized')
        io.emit('auth-error')

      }

    })

    socket.on('disconnect', () => console.log("socket disconnected"))

    socket.on("leave-room", token => {
      try {
        //console.log("Authorizing socket....");
        const decoded = jwt.verify(

          token, // socket.handshake.query.token,
          process.env.JWT_SECRET
        );

        console.log("Leaving room")
        socket.leave(decoded.id)

      } catch (err) {
        console.log("Could not leave");
        // next(new Error("Could not authorize for this board"));
      }
    })

    socket.on("update-canvas", (data) => {
      try {
        //console.log("Authorizing socket....");
        const decoded = jwt.verify(

          data.token, // socket.handshake.query.token,
          process.env.JWT_SECRET
        );

        socket.broadcast.to(decoded.id).emit("update-canvas", data);

      } catch (err) {
        console.log("Could not update");
        // next(new Error("Could not authorize for this board"));
      }
    });

  })

  // io.use((socket, next) => {
  //   try {
  //     console.log("Authorizing socket....");
  //     socket.decoded = jwt.verify(
  //       socket.handshake.query.token,
  //       process.env.JWT_SECRET
  //     );
  //     next();
  //   } catch (err) {
  //     console.log("Could not authorize for this board");
  //     next(new Error("Could not authorize for this board"));
  //   }
  // }).on("connection", async (socket) => {
  //   const board = await Board.findById(socket.decoded.id);
  //   if (!board)
  //     return io.emit("error", {
  //       msg: "Oops.. An unexpected error occured. Try reloading",
  //     });

  //   const roomID = socket.decoded.id;
  //   socket.join(roomID);
  //   socket.on('disconnect', () => console.log("socket disconnected"))
  //   socket.on("leave-room", roomID => {
  //     try {
  //       console.log("Authorizing socket....");
  //       const decoded = jwt.verify(
  //         socket.handshake.query.token,
  //         process.env.JWT_SECRET
  //       );

  //       console.log("Leaving room")
  //       socket.leave(decoded.id)

  //     } catch (err) {
  //       console.log("Could not authorize for this board");
  //       next(new Error("Could not authorize for this board"));
  //     }
  //   })
  //   io.emit("connected");
  //   console.log("Socket connection established");

  //   socket.on("update-canvas", (data) => {
  //     socket.broadcast.to(roomID).emit("update-canvas", data);
  //   });
  // });
};
