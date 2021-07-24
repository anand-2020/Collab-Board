import { useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "./context/auth-context";
import SocketContext from "./context/socket-context";
import socketio from "socket.io-client";
import Home from "./Home";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);

  const checkAuthentication = () => {
    axios
      .get(
        "http://localhost:5000/user/isLoggedIn" //pass jwt token
      )
      .then((res) => {
        if (res.data.data.isAuthenticated) {
          setAuthenticated(true);
          setCurrentUser(res.data.data.user);

          const connection = socketio.connect("http://localhost:5000/", {
            // query: { token: "sendjwthere" },
          });
          setSocket(connection);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const updateAuthData = (isAuthenticated, user) => {
    setAuthenticated(isAuthenticated);
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated: authenticated,
        currentUser: currentUser,
        updateAuthData: updateAuthData,
      }}
    >
      <SocketContext.Provider value={{ socket: socket }}>
        <Home />
      </SocketContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
