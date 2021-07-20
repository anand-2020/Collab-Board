import { Socket } from "socket.io";
import Profile from "./components/Profile";
import { socket, SocketContext } from './store/socket-context'

const App = () => {
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <Profile />
      </SocketContext.Provider>
    </div>
  );
};

export default App;
