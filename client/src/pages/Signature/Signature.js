import { makeStyles } from "@material-ui/core"
import Layout from "../Layout"
import { TextField, Box, Typography, Button } from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useParams } from "react-router-dom";

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

const Signature = () => {
    const classes = useStyles();
    const { documentId } = useParams();
    const handleClick = async e => {
        e.preventDefault();
    }
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
                        onClick={(e) => handleClick(e)}
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