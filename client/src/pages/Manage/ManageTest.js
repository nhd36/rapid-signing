import { makeStyles, Box, TextField, Button, Typography, InputLabel, Input } from "@material-ui/core"
import Layout from "../Layout"
import DocumentBox from "./components/DocumentBox";
import { useState, useEffect } from "react";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
const axios = require("axios");

const useStyles = makeStyles({
    root: {
        margin: "5% 0",
        borderRadius: "50px",
        width: "100%",
        justifyContent: "center",
        border: "2px solid white",
        color: "white",
        minWidth: "800px"
    },
    contentStyle: {
        padding: "5%",
        display: "flex",
        flexDirection: "column",
        color: "white",
        ".MuiInputBase-input": {
            color: "white"
        },
    },
    uploadFormContainer: {
        display: "flex",
        flexDirection: "column",

    },

    textFieldStyle: {
        "& .MuiOutlinedInput-input": {
            color: "red"
        }
    },
    customizedButton: {

    }
})

let SERVER_URL_CREATE_DOCUMENT = `${process.env.REACT_APP_SERVER_PATH}/api/v1/create-document`;
let SERVER_URL_FETCH_DOCUMENTS = `${process.env.REACT_APP_SERVER_PATH}/api/v1/documents`;
let SERVER_URL_DELETE_DOCUMENT = `${process.env.REACT_APP_SERVER_PATH}/api/v1/delete-document`;


const Manage = () => {
    const classes = useStyles();
    const [uploadStatus, setUploadStatus] = useState({ success: false, message: "" })
    const [uploadedFile, setUploadedFile] = useState({ fileName: "", fileDescription: "", chosenFile: "" });
    const [userDocuments, setUserDocuments] = useState([]);


    // handle change event of the input
    const handleFormChange = e => {
        e.persist();
        setUploadedFile(prevDocument => ({ ...prevDocument, [e.target.name]: e.target.value }));
    }


    const fetchDocuments = () => {
        var config = {
            method: 'get',
            url: SERVER_URL_FETCH_DOCUMENTS
        };

        axios(config)
            .then(function (response) {
                let result = response.data;
                setUserDocuments(result["documents"]);
            })
            .catch(function (error) {
                console.log(error);
            });

    };

    const uploadFile = (event) => {
        event.preventDefault();
        if (uploadedFile.fileDescription === "" ||
            uploadedFile.fileName === "" ||
            uploadedFile.chosenFile === "") {
            setUploadStatus({ success: false, message: "Fields cannot be empty." });
            return;
        }
        var file = uploadedFile.chosenFile;
        if (validateSize(event)) {
            setUploadStatus({ success: true, message: "In progress...." });
            // if return true allow to setState
            const data = new FormData();
            data.append('file', file);
            data.append('userEmail', 'ya332@drexel.edu');
            data.append('documentName', uploadedFile.fileName);
            data.append('documentDescription', uploadedFile.fileDescription);

            var config = {
                method: 'post',
                url: SERVER_URL_CREATE_DOCUMENT,
                data: data
            };

            axios(config)
                .then(res => { // then print response status
                    setUploadStatus({ success: true, message: "Upload successfull!" });
                    alert('Upload is successful.', res);
                    fetchDocuments(); // get all documents that belong to user
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
        if (file.size > size) {
            err = file.type + 'is too large, please pick a smaller file\n';
            console.log(err);
        }
        return true
    };

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        fetchDocuments();
    }, []);

    const selectFile = (event) => {
        setUploadedFile(prevDocument => ({ ...prevDocument, [event.target.name]: event.target.files[0] }));
    };

    const deleteDocument = (documentId) => {
        alert("Deleting document with id:" + documentId);
        var config = {
            method: 'delete',
            url: `${SERVER_URL_DELETE_DOCUMENT}/${documentId}`
        };

        axios(config)
            .then(function (response) {
                alert("Document deleted:" + JSON.stringify(response.data))
                fetchDocuments();
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    return (
        <Layout auth={true}>
            <div>
                <Box boxShadow={20} className={classes.root}>
                    <div className={classes.contentStyle}>
                        <div style={{ width: "90%" }}>
                            <h1>My Documents 📝</h1>
                            <p>You can see all the documents you created or received here.</p>
                        </div>
                        <div style={{ width: "100%" }}>
                            {userDocuments.map((data, index) => {
                                return (
                                    <DocumentBox data={data} id={index} triggerParentUpdate={deleteDocument} />
                                )
                            })}
                        </div>
                    </div>
                </Box>
                <Box boxShadow={20} className={classes.root}>
                    <div className={classes.contentStyle}>
                        <div style={{ width: "90%" }}>
                            <h1>Create New Document ✏️</h1>
                            <p>You can upload a document here so that others can sign it.</p>
                        </div>
                        <div className={classes.contentStyle}>
                            <form action="#" id="#" autoComplete="off" onSubmit={e => { uploadFile(e) }}>
                                <InputLabel style={{ color: "white" }} htmlFor="component-simple">File Name:</InputLabel>
                                <Input fullWidth style={{ color: "white" }} id="component-simple" name="fileName" type="text" value={uploadedFile.fileName} onChange={handleFormChange} />

                                <InputLabel style={{ color: "white" }} htmlFor="component-simple">File Description:</InputLabel>
                                <Input fullWidth style={{ color: "white" }} id="component-simple" name="fileDescription" type="text" value={uploadedFile.fileDescription} onChange={handleFormChange} />

                                <TextField style={{ color: "white" }}
                                    name="chosenFile"
                                    type="file"
                                    required
                                    fullWidth
                                    defaultValue={uploadedFile.chosenFile}
                                    onChange={selectFile}
                                />
                                <br style={{ margin: "5%" }} />
                                <br />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    className={classes.button}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Create Document
                                    </Button>
                                <br style={{ margin: "5%" }} />
                                <InputLabel style={{ color: "white" }} htmlFor="component-simple">Upload Status:</InputLabel>
                                <Typography style={{ color: uploadStatus.success ? 'green' : 'red' }}>{uploadStatus.message}</Typography>
                            </form>
                        </div>
                    </div>
                </Box>
            </div>
        </Layout>
    )
}

export default Manage;