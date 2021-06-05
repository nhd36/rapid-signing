import { Route, Redirect } from "react-router-dom"

const RedirectedRoute = ({ component: Component, setToken, userEmail, ...rest }) => {
    const auth = userEmail !== null ? true : false;
    return (
        <Route {...rest}
            render={props =>
                !auth ? (<Component setToken={setToken} {...props}/>) :
                ( <Redirect to={{ pathname: '/manage' }} />)}
        />
    )
}

export default RedirectedRoute;