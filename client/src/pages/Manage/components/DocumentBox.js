import { Box, Button, makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
    root: {
        border: "1px solid lightgrey",
        display: "flex",
        borderRadius: "20px",
        padding: "4% 5% 4% 5%",
        justifyContent: "space-between",
        marginBottom: "1em"
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
        width: "150px"
    }
})

const DocumentBox = ({ data }) => {
    const classes = useStyles();
    return (
        <Box boxShadow={5} className={classes.root}>
            <div className={classes.documentContent}>
                <h3>{data.doc_name}</h3>
                <span style={{ fontStyle: "italic" }}>
                    created at: {data.created_at}
                </span>
            </div>
            <div className={classes.documentButtonBox}>
                <Button
                    className={classes.customizedButton}
                    style={{backgroundColor: "blue"}}
                >
                    View
                </Button>
                <Button
                    className={classes.customizedButton}
                    style={{backgroundColor: "red"}}
                >
                    Delete
                </Button>
            </div>
        </Box>
    )
}

export default DocumentBox;