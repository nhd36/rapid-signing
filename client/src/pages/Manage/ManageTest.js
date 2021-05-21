import { makeStyles, Box } from "@material-ui/core"
import Layout from "../Layout"
import DocumentBox from "./components/DocumentBox"

const useStyles = makeStyles({
    root: {
        margin: "5% 0",
        borderRadius: "50px",
        width: "80%",
    },
    contentStyle: {
        padding: "5%",
        display: "flex"
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
    return (
        <Layout auth={true}>
            <Box boxShadow={20} className={classes.root}>
                <div className={classes.contentStyle}>
                    <div style={{ width: "50%" }}>
                        <h1>My Documents 📝</h1>
                        <p>You can see all the documents you created or received here.</p>
                    </div>
                    <div style={{ width: "50%" }}>
                        {mocks.map((data, index) => {
                            return(
                                <DocumentBox data={data} id={index}/>
                            )
                        })}
                    </div>
                </div>
            </Box>
        </Layout>
    )
}

export default Manage;