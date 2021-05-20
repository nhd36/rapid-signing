import './App.css';

import Register from "./components/Register";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import Manage from './components/Manage/Manage';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navigation-bar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/manage">Manage</Link>
            </li>
          </ul>
        </nav>
        {/* <header className="App-header"></header> */}
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/manage">
            <Manage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
