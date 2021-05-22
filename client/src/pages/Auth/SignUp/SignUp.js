import { makeStyles } from "@material-ui/core"
import AuthLayout from "../AuthLayout"
import { TextField, Box, Typography, Button } from "@material-ui/core"
import { Link, useHistory } from 'react-router-dom';
import { useState } from "react";

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

async function registerUser(credentials) {
    return fetch("http://localhost:5000/api/v1/register", {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
        .then(response => {
            return response.success;
        })
        .catch(error => false);
}

const SignUp = () => {
    const history = useHistory();
    const classes = useStyles();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [repeatPassword, setRepeatPassword] = useState();

    const handleClick = async e => {
        e.preventDefault();
        if (repeatPassword !== password) {
            return false;
        }
        const success = await registerUser({ email, password });
        if (success) {
            history.push("/login");
        }
    }

    return (
        <AuthLayout>
            <h1>Sign Up</h1>
            <Box className={classes.dataBox}>
                <TextField
                    className={classes.inputField}
                    id="standard-basic"
                    label="Email"
                    required
                    onChange={e => setEmail(e.target.value)}
                />
                <br style={{ margin: "5%" }} />
                <TextField
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    fullWidth
                    autoComplete="current-password"
                    required
                    onChange={e => setPassword(e.target.value)}
                />
                <br style={{ margin: "5%" }} />
                <TextField
                    id="standard-password-input"
                    label="Re-enter Password"
                    type="password"
                    fullWidth
                    autoComplete="current-password"
                    required
                    onChange={e => setRepeatPassword(e.target.value)}
                />
                <br />
            </Box>

            <Typography style={{color: 'black'}}>
                Already Have An Account?
                    <Link to="/login" style={{backgroundColor:"white"}}> Sign In Here</Link>
            </Typography>

            <Button 
                className={classes.button}
                onClick={e => handleClick(e)}
                >
                    Sign Up
                </Button>
        </AuthLayout>
    )
}

export default SignUp;