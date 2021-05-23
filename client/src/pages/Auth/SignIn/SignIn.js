import { makeStyles } from "@material-ui/core"
import AuthLayout from "../AuthLayout"
import { TextField, Box, Typography, Button } from "@material-ui/core"
import { useState } from "react"
import PropTypes from "prop-types"
import { useHistory } from "react-router"
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    dataBox: {
        margin: "10% 0 10% 0",
        display: "flex",
        flexDirection: "column"
    },
    inputField: {
        width: "400px"
    },
    button: {
        marginTop: "10%",
        backgroundColor: "blue",
        color: "white",
        fontWeight: 600
    }
})


async function loginUser(credentials) {
    return fetch("http://localhost:5000/api/v1/login", {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
        .then(response => {
            if (response.success) {
                return response.accessToken;
            }
            return null;
        })
        .catch(error => null);
}

const SignIn = ({ setToken }) => {
    const history = useHistory();
    const classes = useStyles();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const handleClick = async e => {
        e.preventDefault();
        const token = await loginUser({ email, password });
        setToken(token);
        history.push("/manage")
    }

    return (
        <AuthLayout>
            <h1>Sign In</h1>
            <Box className={classes.dataBox}>
                <TextField
                    className={classes.inputField}
                    id="standard-basic"
                    label="Email"
                    required
                    onChange={e => setEmail(e.target.value)}
                />
                <br style={{ margin: "2%" }} />
                <TextField
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    fullWidth
                    autoComplete="current-password"
                    required
                    onChange={e => setPassword(e.target.value)}
                />
                <br />
            </Box>

            <Typography style={{color:"black"}}>
                Not registered yet?
                    <Link to="/register" style={{backgroundColor:"white"}}> Sign Up Here</Link>
            </Typography>

            <Button
                className={classes.button}
                onClick={(e) => handleClick(e)}
            >
                Sign In
            </Button>
        </AuthLayout>
    )
}

SignIn.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default SignIn;