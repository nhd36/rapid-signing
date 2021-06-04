import { makeStyles, useForkRef } from "@material-ui/core"
import Layout from "../Layout"
import { TextField, Box, Typography, Button } from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const useStyles = makeStyles({
    root: {
        fontFamily: 'monospace',
        borderRadius: "50px",
        display: "flex",
        flexDirection: "column",
        margin: "10% 0 10% 0",
        backgroundColor: "white",
        padding: "5% 10% 5% 10%",
        textAlign: "center",
    },
    inputField: {
        width: "400px"
    },
    button: {
        borderRadius: "10px",
        textTransform: "none",
        fontSize: "1em",
        height: "fit-content",
        marginRight: "1em",
        fontWeight: 600,
        textAlign: "center",
        border: "1px solid black"
    },
    h: {
        color: "black"
    }
})

let SERVER_URL_GET_FILE = `${process.env.REACT_APP_SERVER_PATH}/api/v1/file`;
let SERVER_URL_GET_DOCUMENT = `${process.env.REACT_APP_SERVER_PATH}/api/v1/document`;

const Signature = () => {
    console.log("Inside Signature",)
    const classes = useStyles();
    const [lastVersionId, setLastVersionId] = useState("")
    const { documentId } = useParams();
    console.log("documentId", documentId)
    const handleClick = async e => {
        e.preventDefault();
    }


    const fetchDocument = async (documentId) => {
        console.log(documentId)
        var config = {
            method: 'GET',
            url: `${SERVER_URL_GET_DOCUMENT}/${documentId}`
        };

        await axios(config)
            .then(function (response) {
                setLastVersionId(response.data.document.lastVersionId)
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    const downloadFile = () => {
        console.log("inside")
        var config = {
            method: 'GET',
            url: `${SERVER_URL_GET_FILE}/${lastVersionId}`
        };

        axios(config)
            .then(function (response) {
                console.log(response)
                console.log(JSON.stringify(response.data));
                // Create blob link to download
                const url = window.URL.createObjectURL(
                    new Blob([response.data]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `${lastVersionId}.pdf`,
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

    useEffect(() => {
        fetchDocument(documentId);
    }, [documentId]);

    return (
        <Layout auth={false}>

            <Box boxShadow={20} className={classes.root}>
                <div className={classes.h}>
                    <h1 >Document Id: {documentId}</h1>
                    <h2> Upload Your Signed Document </h2>
                    <Typography style={{ color: "black" }}>
                        Download the file, sign it and upload it to RapidSign.
                        <br></br>
                        We will lock this document in case some one else also wants to
                        sign it at the same time as you do.
                    </Typography>
                </div>
                <TextField
                    inputStyle={{ textAlign: 'center' }}
                    id="standard-basic"
                    label="Email"
                    fullWidth
                    required
                    onChange={e => { }}
                />
                <br style={{ margin: "5%" }} />
                <TextField
                    name="upload-file"
                    type="file"
                    required
                    onChange={e => { }}
                />
                <br style={{ margin: "5%" }} />
                <br />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={(e) => downloadFile()}
                    >
                        Download
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={(e) => handleClick(e)}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload The Signed Document
                    </Button>
                </div>
            </Box>
        </Layout>
    )
}

export default Signature;