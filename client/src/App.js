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
  let userEmail = null;
  // Check for token to keep user logged in
  if (sessionStorage.getItem("token")) {
    // Set auth token header auth
    const sessionToken = JSON.parse(sessionStorage.getItem("token"));
    /* setToken(token);*/
    console.log(sessionToken)
    // setToken(sessionToken);
    setAuthHeader(sessionToken);
    // Decode token and get user info and exp
    const decoded = jwt_decode(sessionToken);
    userEmail = decoded.email;
    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      // Redirect to login
      sessionStorage.setItem("token", null)
      window.location.href = "./login";
    }
  } else {
    window.location.href = "./login";
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <ProtectedRoute exact path="/manage" component={Manage} userEmail={userEmail} />
          <Route exact path="/login">
            <SignIn setToken={setToken} />
          </Route>
          <Route exact path="/register">
            <SignUp />
          </Route>
          <ProtectedRoute exact path="/:documentId" component={Signature} userEmail={userEmail} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
