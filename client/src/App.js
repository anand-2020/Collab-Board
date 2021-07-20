import Profile from "./components/Profile";
import { socket, SocketContext } from './store/socket-context'
import Navbar from './components/UI/Navbar'

const App = () => {
  return (
    <div className="App">

      <Navbar />
      <SocketContext.Provider value={socket}>
        <Profile />
      </SocketContext.Provider>
    </div>
  );
};

export default App;
