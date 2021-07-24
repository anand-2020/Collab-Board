import { createContext } from "react";

const SocketContext = createContext({
  socket: null,
  updateSocketData: () => {},
});

export default SocketContext;
