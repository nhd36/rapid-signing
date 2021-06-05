import { makeStyles } from "@material-ui/core"
import Layout from "../Layout"
import { TextField, Box, Typography, Button, InputLabel } from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useHistory, useParams } from "react-router-dom";
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
let SERVER_URL_UPLOAD_FILE = `${process.env.REACT_APP_SERVER_PATH}/api/v1/upload`;
let SERVER_URL_LOCK_FILE = `${process.env.REACT_APP_SERVER_PATH}/api/v1/lock-document`;
let SERVER_URL_UNLOCK_FILE = `${process.env.REACT_APP_SERVER_PATH}/api/v1/unlock-document`

const Signature = ({ userEmail }) => {
    console.log("Inside Signature",)
    const classes = useStyles();
    const [uploadStatus, setUploadStatus] = useState({ success: false, message: "" })
    const [uploadedFile, setUploadedFile] = useState({ signedBy: "", chosenFile: "" });
    const [lastVersionId, setLastVersionId] = useState("")
    const { documentId } = useParams();

    const [code, setCode] = useState(null);
    const history = useHistory();

    const selectFile = (event) => {
        setUploadedFile(prevDocument => ({ ...prevDocument, [event.target.name]: event.target.files[0] }));
    };

    const lockDocument = async (documentId) => {
        console.log("lock");
        var config = {
            method: 'post',
            url: `${SERVER_URL_LOCK_FILE}/${documentId}`,
            data: { userEmail }
        };

        await axios(config)
            .then(res => { // then print response status
                setCode(res.data.code);
                return true;
            })
            .catch(err => { // then print response status
                alert(err.response.data.error);
                history.push("/manage");
                return false;
            })
    }

    const unlockDocument = async (documentId) => {
        console.log("unlock");
        console.log(code);
        var config = {
            method: 'post',
            url: `${SERVER_URL_UNLOCK_FILE}/${documentId}`,
            data: { code }
        };

        await axios(config)
            .then(res => { // then print response status
                console.log(res);
                return true;
            })
            .catch(err => { // then print response status
                const response = err.response;
                console.log(response);
                if (!response.success) {
                    return false;
                }
                return false;
            })
    }

    const uploadFile = (event) => {
        event.preventDefault();


        var file = uploadedFile.chosenFile;
        if (validateSize(event)) {
            setUploadStatus({ success: true, message: "In progress...." });
            // if return true allow to setState
            const data = new FormData();
            data.append('file', file);
            data.append('id', documentId);
            data.append('signedBy', uploadedFile.signedBy);

            var config = {
                method: 'post',
                url: SERVER_URL_UPLOAD_FILE,
                data: data
            };

            axios(config)
                .then(res => { // then print response status
                    setUploadStatus({ success: true, message: "Upload successfull!" });
                    console.log('Upload is successful.', res);
                    alert('Upload is successful.', res);
                    unlockDocument(documentId);
                    history.push('/manage')
                })
                .catch(err => { // then print response status
                    setUploadStatus({ success: false, message: "Upload failed. Try again later." });
                    console.log('Upload failed', err);
                    alert(err)
                })
        }
    }

    const validateSize = (event) => {
        //let file = event.target.files[0];
        let file = uploadedFile;
        let size = 30000;
        let err = '';
        console.log(file.size);
        if (file.size > size) {
            err = file.type + 'is too large, please pick a smaller file\n';
            console.log(err);
        }
        return true
    };



    const fetchDocument = async (documentId) => {
        await lockDocument(documentId)
            .then(res => {
                var config = {
                    method: 'GET',
                    url: `${SERVER_URL_GET_DOCUMENT}/${documentId}`
                };
                axios(config)
                    .then(function (response) {
                        setLastVersionId(response.data.document.lastVersionId)
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
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

    // handle change event of the input
    const handleFormChange = e => {
        e.persist();
        setUploadedFile(prevDocument => ({ ...prevDocument, [e.target.name]: e.target.value }));
    }


    return (
        <Layout auth={true}>

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
                    name="signedBy"
                    fullWidth
                    required
                    value={uploadedFile.signedBy}
                    onChange={handleFormChange}
                />
                <br style={{ margin: "5%" }} />
                <TextField
                    name="chosenFile"
                    type="file"
                    required
                    defaultValue={uploadedFile.chosenFile}
                    onChange={selectFile}
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
                        onClick={(e) => uploadFile(e)}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload The Signed Document
                    </Button>
                    <br style={{ margin: "5%" }} />
                    <InputLabel style={{ color: "white" }} htmlFor="component-simple">Upload Status:</InputLabel>
                    <Typography style={{ color: uploadStatus.success ? 'green' : 'red' }}>{uploadStatus.message}</Typography>
                </div>
            </Box>
        </Layout>
    )
}

export default Signature;