import { Box, Button, makeStyles, Modal, Paper } from "@material-ui/core";
import download from "downloadjs";
import axios from "axios";
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { useState } from "react";
import VersionBox from "./VersionBox"
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
    root: {
        border: "1px solid lightgrey",
        display: "flex",
        borderRadius: "20px",
        padding: "4% 5% 4% 5%",
        justifyContent: "space-between",
        marginBottom: "1em",
        color: "white"
    },
    documentButtonBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    customizedButton: {
        borderRadius: "50px",
        marginBottom: "1em",
        color: "white",
        fontWeight: 900,
        minWidth: "200px"
    },
    downloadButton: {
        borderRadius: "50px",
        color: "white",
    },
    popover: {
        padding: "10px",
        height: "50px",
        fontWeight: 900,
        color: "black"
    },
    documentContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    }
})
let SERVER_URL_GET_FILE = `${process.env.REACT_APP_SERVER_PATH}/api/v1/file`;

const DocumentBox = ({ data, triggerParentUpdate }) => {
    const [version, setVersion] = useState(false)

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopOverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;



    const downloadFile = (fileId) => {
        var config = {
            method: 'GET',
            url: `${SERVER_URL_GET_FILE}/${fileId}`,
            responseType: 'blob'
        };
        axios(config)
            .then(function (response) {
                // Use downloadjs to avoid download issues when PDF format is new like 1.7.
                // Source: https://stackoverflow.com/questions/64037367/how-to-pipe-a-pdf-download-response-from-an-api-node-express-to-a-client-reac
                download(response.data, `${fileId}.pdf`, response.headers['content-type'])
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const copyLink = (event, id) => {
        setAnchorEl(event.currentTarget);
        let hiddenLink = document.createElement("input");
        hiddenLink.style = "position: absolute; left: -1000px; top: -1000px;";
        hiddenLink.value = window.location.origin + "/" + id;
        document.body.appendChild(hiddenLink);
        hiddenLink.select();
        document.execCommand("copy");
        document.body.removeChild(hiddenLink);
    }
    console.log(data.versions)
    return (
        <Box boxShadow={5} className={classes.root}>
            <div className={classes.documentContent}>
                <h3>{data._id}</h3>
                <div style={{ fontStyle: "italic" }}>
                    Created at: {data.createdAt}
                </div>
                <div>
                    Document Name: {data.documentName}
                </div>
                <div>
                    Document Description: {data.documentDescription}
                </div>
                <div>
                    Created By: {data.userEmail}
                </div>
                <div>
                    <Button
                        className={classes.customizedButton}
                        style={{ backgroundColor: "blue", marginTop: "2%" }}
                        onClick={() => setVersion(true)}
                    >
                        SIGNATURES
                    </Button>
                    <Modal
                        open={version}
                        onClose={() => setVersion(false)}
                    >
                        <Box style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh"
                        }}>
                            <Paper style={{
                                width: "50vw",
                                height: "50vh",
                                borderRadius: "10px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column"
                            }}>
                                <Box style={{
                                    width: "100%",
                                    padding: "1% 2%",
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}>
                                    <Button style={{
                                        width: "2%",
                                    }}
                                        onClick={() => setVersion(false)}
                                    >
                                        <CloseIcon />
                                    </Button>
                                </Box>
                                <Box style={{
                                    width: "80%",
                                    height: "80%",
                                    overflowY: "scroll",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    {data.versions.length > 0 && (
                                        <div style={{ width: "90%" }}>
                                            <ol style={{
                                                color: "black",
                                                display: "flex",
                                                justifyContent: "center",
                                                flexDirection: "column",
                                                alignItems: "center"
                                            }}>
                                                {data.versions.map((version, index) =>
                                                    <VersionBox key={index} downloadFile={downloadFile} version={version} />
                                                )}
                                            </ol>
                                        </div>
                                    )}
                                    {data.versions.length === 0 && (
                                        <Box>
                                            <h1>No Signatures Found</h1>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </Box>
                    </Modal>
                </div>
            </div>
            <div className={classes.documentButtonBox}>
                <Button
                    className={classes.customizedButton}
                    style={{ backgroundColor: "blue" }}
                    href={`/${data._id}`}
                >
                    SHARE TO SIGN
                </Button>
                <Button
                    className={classes.customizedButton}
                    style={{ backgroundColor: "blue" }}
                    onClick={(e) => copyLink(e, data._id)}
                >
                    COPY LINK
                </Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handlePopOverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Typography className={classes.popover}>Copied to Clipboard: {window.location.origin + "/" + data._id}</Typography>
                </Popover>
                <Button
                    className={classes.customizedButton}
                    style={{ backgroundColor: "red" }}
                    onClick={() => triggerParentUpdate(data._id)}
                >
                    Delete
                </Button>
            </div>
        </Box>
    )
}

export default DocumentBox;