import { makeStyles, Box } from "@material-ui/core"
import NavBar from "../components/NavBar"

const useStyles = makeStyles({
    root: {
        height: "100%",
        width: "100%"
    },
    childLayout: {
        marginTop: "4em",
        display: "flex",
        justifyContent: "center"
    }
})

const Layout = ({children}) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <NavBar/>
            <Box className={classes.childLayout}>
                {children}
            </Box>
        </div>
    )
}

export default Layout;