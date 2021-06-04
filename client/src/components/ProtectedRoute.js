import { Route, Redirect } from "react-router-dom"

const ProtectedRoute = ({ component: Component, userEmail, ...rest }) => {
    const auth = userEmail !== null ? true : false;
    return (
        <Route {...rest}
            render={props =>
                auth ? (<Component {...props} userEmail={userEmail} />) : (
                    <Redirect to={{ pathname: '/login' }} />
                )}
        />
    )
}

export default ProtectedRoute;