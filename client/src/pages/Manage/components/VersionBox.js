import { Box, makeStyles, Button, Paper } from "@material-ui/core"
import GetAppIcon from '@material-ui/icons/GetApp';


const useStyle = makeStyles({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    boxContent: {
        fontSize: 20
    },
    boxButton: {
        display: "flex",
        flexDirection: "column"
    },
    versionList: {
        width: "100%",
        margin: "3% 0",
        padding: "2%",
    },
})

const VersionBox = ({ version, downloadFile, styleButton, key }) => {
    const classes = useStyle();
    return (

        <Paper elevation={10} className={classes.versionList}>
            <li className={classes.root} key={key}>
                <Box className={classes.boxContent}>
                    {version.versionId}
                    <br></br>
                    <span style={{ fontStyle: "italic" }}>signed by</span>
                    <br></br>
                    {version.signedBy}
                    <br></br>
                </Box>
                <Box className={classes.boxButton}>
                    <Button
                        className={styleButton}
                        style={{ backgroundColor: "blue" }}
                        onClick={(e) => downloadFile(version.versionId)}
                        startIcon={<GetAppIcon />}
                    >
                        Download
                    </Button>
                    {/* <br/>
                    <Button
                        className={styleButton}
                        style={{ backgroundColor: "red" }}
                    >
                        Delete
                    </Button> */}
                </Box>

            </li>
        </Paper>
    )
}

export default VersionBox;