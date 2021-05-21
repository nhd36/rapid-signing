import { makeStyles } from "@material-ui/core"
import AuthLayout from "../AuthLayout"
import { TextField, Box, Typography, Button } from "@material-ui/core"
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

const SignUp = () => {
    const classes = useStyles();
    return (
        <AuthLayout>
            <h1>Sign Up</h1>
            <Box className={classes.dataBox}>
                <TextField
                    className={classes.inputField}
                    id="standard-basic"
                    label="Email"
                    required
                />
                <br style={{ margin: "5%" }} />
                <TextField
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    fullWidth
                    autoComplete="current-password"
                    required
                />
                <br style={{ margin: "5%" }} />
                <TextField
                    id="standard-password-input"
                    label="Re-enter Password"
                    type="password"
                    fullWidth
                    autoComplete="current-password"
                    required
                />
                <br />
            </Box>

            <Typography>
                Already Have An Account?
                    <Link to="/login"> Login Here</Link>
            </Typography>
            
            <Button className={classes.button}>Register</Button>
        </AuthLayout>
    )
}

export default SignUp;