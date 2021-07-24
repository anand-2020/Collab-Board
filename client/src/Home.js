import { BrowserRouter as Router, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Auth from "./components/auth/Auth";

const Home = () => {
  return (
    <Router>
      <Route path="/auth" exact component={Auth} />
      <Route path="/user/profile" exact component={Profile} />
    </Router>
  );
};

export default Home;
