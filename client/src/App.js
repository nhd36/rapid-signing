import Manage from "./pages/Manage/Manage";
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import { useToken } from './customizedHook/useToken';
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { token, setToken } = useToken();
  console.log(token);
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <ProtectedRoute exact path="/" component={Manage} token={token} />
          <Route exact path="/login">
            <SignIn setToken={setToken} />
          </Route>
          <Route exact path="/register">
            <SignUp />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
