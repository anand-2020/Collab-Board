import { createContext } from "react";

const SocketContext = createContext({
  socket: null,
});

export default SocketContext;
