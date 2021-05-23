import { Route, Redirect } from "react-router-dom"

const ProtectedRoute = ({ component: Component, token, ...rest }) => {
    const auth = token !== null ? true : false;
    return (
        <Route {...rest}
            render={props =>
                auth ? (<Component {...props} />) : (
                    <Redirect to={{ pathname: '/login'}} />
                )}
        />
    )
}

export default ProtectedRoute;