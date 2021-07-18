const socketio = require("socket.io");

module.exports.setupSocket = (server) => {
    const io = socketio(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        io.emit("connected")
        socket.on('canvas-data', (data) => {
            socket.broadcast.emit('canvas-data', data);
            console.log("image sent")
        });
    });
};