import { makeStyles, Paper } from "@material-ui/core"
import Layout from "../Layout"

const useStyles = makeStyles({
    root: {
        fontFamily: 'monospace',
        borderRadius: "150px",
        display: "flex",
        flexDirection: "column",
        margin: "10% 0",
        backgroundColor: "white",
        padding: "2% 10% 5% 10%",
        textAlign: "center",
    }
})

const AuthLayout = ({ children }) => {
    const classes = useStyles();
    return (
        <Layout>
            <Paper className={classes.root}>
                <form>
                    {children}
                </form>
            </Paper>
        </Layout>
    )
}

export default AuthLayout;