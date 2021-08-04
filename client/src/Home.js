import { BrowserRouter as Router, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Auth from "./components/auth/Auth";
import BoardRoom from './components/BoardRoom'

const Home = () => {
  return (
    <Router>
      <Route path="/auth" exact component={Auth} />
      <Route path="/user/profile" exact component={Profile} />
      <Route path="/user/board" exact render={props => <BoardRoom {...props}></BoardRoom>} />
    </Router>
  );
};

export default Home;
