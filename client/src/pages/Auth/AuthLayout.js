import { makeStyles, Box } from "@material-ui/core"
import Layout from "../Layout"

const useStyles = makeStyles({
    root: {
        fontFamily: 'monospace',
        borderRadius: "150px",
        display: "flex",
        flexDirection: "column",
        margin: "10% 0 10% 0",
        backgroundColor: "white",
        padding: "5% 10% 5% 10%",
        textAlign: "center",
    }
})

const AuthLayout = ({ children }) => {
    const classes = useStyles();
    return (
        <Layout auth={false}>
            <Box boxShadow={20} className={classes.root}>
                <form>
                    {children}
                </form>
            </Box>
        </Layout>
    )
}

export default AuthLayout;