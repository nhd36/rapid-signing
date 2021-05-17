import { AppBar, makeStyles, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        position: "fixed",
        backgroundColor: "#282c34",
        height: "4em"
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between"
    }
})

const NavBar = () => {
    const classes = useStyles();
    return (
        <AppBar className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <Typography variant="h4">
                    Home
                </Typography>
                <Typography variant="h4">
                    🚀 RapidSign 🚀
                </Typography>
                <Typography>
                    Hello World
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar;