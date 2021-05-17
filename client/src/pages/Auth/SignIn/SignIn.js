import { makeStyles } from "@material-ui/core"
import AuthLayout from "../AuthLayout"
import { TextField, Box, Typography, Button } from "@material-ui/core"
import { useState } from "react"
import PropTypes from "prop-types"

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

const handleClick = (email, password) => {
    console.log(email, password);
}

const SignIn = ({ setToken }) => {
    const classes = useStyles();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
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
                <br />
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

            <Typography>
                Not Sign Up?
                    <a href="/">Click Here</a>
            </Typography>

            <Button 
                className={classes.button}
                onClick={() => handleClick(email, password)}
            >
                    Log In
            </Button>
        </AuthLayout>
    )
}

SignIn.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default SignIn;