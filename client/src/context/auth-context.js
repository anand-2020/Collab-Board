import { createContext } from "react";

const AuthContext = createContext({
  authenticated: false,
  currentUser: null,
  updateAuthData: () => {},
});

export default AuthContext;
