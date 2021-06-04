import { Route, Redirect } from "react-router-dom"
import jwt_decode from "jwt-decode";

const ProtectedRoute = ({ component: Component, token, ...rest }) => {
    const auth = token !== null ? true : false;
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    return (
        <Route {...rest}
            render={props =>
                auth ? (<Component {...props} userEmail={decoded.email} />) : (
                    <Redirect to={{ pathname: '/login' }} />
                )}
        />
    )
}

export default ProtectedRoute;