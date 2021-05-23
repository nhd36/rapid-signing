import {
    AppBar, makeStyles, Toolbar, Typography, IconButton,
    Menu, MenuItem, Button
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { logout } from "../customizedHook/useToken"

const useStyles = makeStyles({
    root: {
        position: "fixed",
        backgroundColor: "#282c34",
        height: "4em"
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    logoStyle: {
        fontFamily: 'Balsamiq Sans, cursive',
        textDecoration: "none",
        color: "white",
        "&:hover": {
            color: "black",
            backgroundColor: "inherit"
        }
    },
    itemMenu: {
        color: "black",
        textDecoration: "none",
    },
    buttonLayout: {
        borderRadius: "10px",
        textTransform: "none",
        border: "1px solid white",
        fontSize: "1em",
        height: "fit-content",
        color: "white",
        marginRight: "1em",
        fontWeight: 600,
        "&:hover": {
            backgroundColor: "white",
            color: 'black',
            border: "1px solid black"
        }
    },
})

const NavBar = ({ auth }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const classes = useStyles();
    const history = useHistory();

    const handleLogout = () => {
        logout();
        history.push('/login')
    }
    return (
        <AppBar className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <Link to="/" className={classes.logoStyle}>
                    <Typography variant="h4">
                        🚀 RapidSign 🚀
                    </Typography>
                </Link>
                <Typography>
                    {auth && (
                        <>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem>
                                    <Link to="/" className={classes.itemMenu}>
                                        Home
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link to="/manage" className={classes.itemMenu}>
                                        Manage
                                    </Link>
                                </MenuItem>
                                <MenuItem className={classes.itemMenu}> 
                                    <Link to="/login" onClick={handleLogout} className={classes.itemMenu}>
                                        Log Out
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                    {!auth && (
                        <div style={{ display: "flex" }}>
                            <Link to="/manage">
                                <Button className={classes.buttonLayout} style={{backgroundColor: "red"}}> Manage </Button>
                            </Link>
                            <Link to="/login">
                                <Button className={classes.buttonLayout}> Sign In </Button>
                            </Link>
                            <Link to="/register">
                                <Button className={classes.buttonLayout}> Sign Up </Button>
                            </Link>
                        </div>
                    )}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar;