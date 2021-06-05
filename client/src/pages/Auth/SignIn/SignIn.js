import { makeStyles, Slide } from "@material-ui/core"
import AuthLayout from "../AuthLayout"
import { TextField, Box, Typography, Button } from "@material-ui/core"
import { useState } from "react"
import PropTypes from "prop-types"
import { useHistory } from "react-router"
import { Link } from 'react-router-dom';
import { Alert } from '@material-ui/lab';

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


const SignIn = ({ setToken }) => {
    const history = useHistory();
    const classes = useStyles();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [statusMessage, setStatusMessage] = useState('');

    async function loginUser(credentials) {
        return fetch(`${process.env.REACT_APP_SERVER_PATH}/api/v1/login`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(credentials)
        })
            .then(data => data.json())
            .then(response => {
                return response;
            })
            .catch(error => {
                return {
                    success: false,
                    error: "Server corrupted. Try again!"
                }
            });
    }


    const handleClick = async e => {
        e.preventDefault();
        if (!password || !email) {
            setStatusMessage("Fields cannot be empty.")
            return false;
        }
        const res = await loginUser({ email, password });
        if (res.success) {
            setToken(res.accessToken);
        } else {
            setStatusMessage(res.error);
            sessionStorage.removeItem('token');
            return;
        }
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
            {statusMessage && <Alert variant="filled" severity="error">
                Sign In Failed. {statusMessage}
            </Alert>
            }
            <Button
                className={classes.button}
                onClick={(e) => handleClick(e)}
            >
                Sign In
            </Button>
            <Typography style={{ marginTop: "5%", color: 'black' }}>
                Not registered yet?
                    <Link to="/register" style={{ backgroundColor: "white" }}> Sign Up Here</Link>
            </Typography>
        </AuthLayout>
    )
}

SignIn.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default SignIn;