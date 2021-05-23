import { Box, Button, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";

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
    }
})

const DocumentBox = ({ data }) => {
    let SERVER_URL_GET_DOCUMENT = `${process.env.REACT_APP_SERVER_PATH}/api/v1/document`;
    let SERVER_URL_DELETE_DOCUMENT = `${process.env.REACT_APP_SERVER_PATH}/api/v1/delete-document`;

    const classes = useStyles();
    const deleteDocument = (event) => {
        
        var config = {
            method: 'delete',
            url: `${SERVER_URL_DELETE_DOCUMENT}/${event.target.documentId}`
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    const downloadFile = (event) => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        let fileName = event.target.fileName;
        fetch(`${SERVER_URL_GET_DOCUMENT}/${fileName}/`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
    return (
        <Box boxShadow={5} className={classes.root}>
            <div className={classes.documentContent}>
                <h3>{data.doc_name}</h3>
                <span style={{ fontStyle: "italic" }}>
                    created at: {data.created_at}
                </span>
            </div>
            <div className={classes.documentButtonBox}>
                <Link to={"/"+ data.id} target="_blank" rel="noopener noreferrer">
                    <Button
                        className={classes.customizedButton}
                        style={{ backgroundColor: "blue" }}
                    >
                        Sign
                </Button>
                </Link>
                <Button
                    className={classes.customizedButton}
                    style={{ backgroundColor: "blue" }}
                    onClick={(e) => downloadFile(e)}
                > 
                    Download
                </Button>
                <Button
                    className={classes.customizedButton}
                    style={{ backgroundColor: "red" }}
                >
                    Delete
                </Button>
            </div>
        </Box>
    )
}

export default DocumentBox;