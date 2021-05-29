import Manage from "./pages/Manage/ManageTest"
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import { useToken } from './customizedHook/useToken';
import ProtectedRoute from './components/ProtectedRoute'
import Landing from "./pages/Landing/Landing";
import Signature from "./pages/Signature/Signature";

function App() {
  const { token, setToken } = useToken();

  console.log("localStorage", localStorage.getItem("token"));
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
          <Route path="/:documentId">
            <Signature />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
