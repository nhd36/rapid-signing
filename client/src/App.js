import Manage from "./pages/Manage/Manage"
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import { useToken } from './customizedHook/useToken';
import ProtectedRoute from './components/ProtectedRoute'
import Landing from "./pages/Landing/Landing";
import Signature from "./pages/Signature/Signature";
import jwt_decode from "jwt-decode";
import setAuthHeader from "./util/setAuthHeader";

function App() {
  const { token, setToken } = useToken();

  // Check for token to keep user logged in
  if (sessionStorage.getItem("token")) {
    // Set auth token header auth
    const token = JSON.parse(sessionStorage.getItem("token"));
    /* setToken(token);*/
    setAuthHeader(token);

    // Decode token and get user info and exp
    const decoded = jwt_decode(token);

    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      // Redirect to login
      setToken(null);
      window.location.href = "./";
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <ProtectedRoute exact path="/manage" component={Manage} token={token} />
          <Route exact path="/login">
            <SignIn setToken={setToken} />
          </Route>
          <Route exact path="/register">
            <SignUp />
          </Route>
          <ProtectedRoute exact path="/:documentId" component={Signature} token={token} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
