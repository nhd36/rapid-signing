import { makeStyles, Box, TextField, FormLabel, Button, Typography, InputLabel, Input } from "@material-ui/core"
import Layout from "../Layout"
import DocumentBox from "./components/DocumentBox"
import { useState } from "react";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles({
    root: {
        margin: "5% 0",
        borderRadius: "50px",
        width: "100%",
        justifyContent: "center",
        border: "2px solid white",
        color: "white"
    },
    contentStyle: {
        padding: "5%",
        display: "flex",
        flexDirection: "column",
        color: "white",
        ".MuiInputBase-input" : {
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

const mocks = [
    {
        doc_name: "Document 1",
        created_at: "10:50:50 12/2/2020"
    },
    {
        doc_name: "Document 2",
        created_at: "10:50:50 12/2/2020"
    },
    {
        doc_name: "Document 3",
        created_at: "10:50:50 12/2/2020"
    },
]

const Manage = () => {
    const classes = useStyles();
    const [uploadStatus, setUploadStatus] = useState('')
    const [uploadedFile, setUploadedFile] = useState()
    const handleClick = async e => {
        e.preventDefault();
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
                            {mocks.map((data, index) => {
                                return (
                                    <DocumentBox data={data} id={index} />
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
                            <form method="post" action="#" id="#" autoComplete="off">
                            <InputLabel style={{ color: "white" }} htmlFor="component-simple">File Name:</InputLabel>
                            <Input fullWidth style={{ color: "white" }}  id="component-simple" value={"test"} onChange={e => {}} />

                            <InputLabel style={{ color: "white" }} htmlFor="component-simple">File Description:</InputLabel>
                            <Input fullWidth style={{ color: "white" }}  id="component-simple" value={"test"} onChange={e => {}} />

                            <InputLabel style={{ color: "white" }} htmlFor="component-simple">Upload Your File:</InputLabel>
                            <Input fullWidth style={{ color: "white" }}  id="component-simple" value={"test"} onChange={e => {}} />
                               
                                <TextField style={{ color: "white" }}
                                    name="upload-file"
                                    type="file"
                                    required
                                    fullWidth
                                    onChange={e => { }}
                                />
                                <br style={{ margin: "5%" }} />
                                <br />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        onClick={(e) => handleClick(e)}
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Upload The Signed Document
                                    </Button>
                                    <br style={{ margin: "5%" }} />
                                    <InputLabel style={{ color: "white" }} htmlFor="component-simple">Upload Status:</InputLabel>
                                    <Typography style={{ color: uploadStatus ? 'green' : 'red' }}>{uploadStatus}</Typography>
                            </form>
                        </div>
                    </div>
                </Box>
            </div>
        </Layout>
    )
}

export default Manage;