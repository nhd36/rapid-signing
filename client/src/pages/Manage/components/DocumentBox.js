import { Box, Button, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import GetAppIcon from '@material-ui/icons/GetApp';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { useState } from "react";


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
    versionList:{
        border: "1px solid lightgrey",
        display: "flex",
        borderRadius: "2px",
        minWidth: "300px",
        marginBottom: "20px",
        textAlign: "right"
    }
})
let SERVER_URL_GET_FILE = `${process.env.REACT_APP_SERVER_PATH}/api/v1/file`;

const DocumentBox = ({ data, triggerParentUpdate }) => {

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
            url: `${SERVER_URL_GET_FILE}/${fileId}`
        };

        axios(config)
            .then(function (response) {
                // Create blob link to download
                const url = window.URL.createObjectURL(
                    new Blob([response.data]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `${fileId}.pdf`,
                );

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);

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
                    Signatures :
                    {data.versions && (
                        <div  style={{ display: "flex", flexDirection: "column", maxWidth:"100px" }}>
                            <ol style={{ color:"white"}}>
                                {data.versions.map((version, index) =>
                                <div className={classes.versionList}>
                                    <li key={index}>{version.versionId} signed by {version.signedBy}
                                        <Button
                                            className={classes.downloadButton}
                                            style={{ backgroundColor: "blue" }}
                                            onClick={(e) => downloadFile(version.versionId)}
                                            startIcon={<GetAppIcon />}
                                        >
                                            Download
                                    </Button>
                                    </li>
                                    </div>
                                )}
                            </ol>
                        </div>
                    )}
                    {data.versions.length === 0 && (
                        <>
                            <h4>No signatures received</h4>
                        </>
                    )}
                </div>
            </div>
            <div className={classes.documentButtonBox}>
                <Link to={"/" + data._id} >
                    <Button
                        className={classes.customizedButton}
                        style={{ backgroundColor: "blue" }}
                    >
                        SHARE TO SIGN
                </Button>
                </Link>
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