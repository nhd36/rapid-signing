import React from 'react';
import NavBar from '../../components/NavBar';
import "./Manage.css"
const axios = require("axios");

class Manage extends React.Component {
    constructor(props) {
        super(props)
        this.SERVER_URL = process.env.REACT_APP_SERVER_PATH;

        this.SERVER_URL_FETCH_FILES = `${this.SERVER_URL}/api/v1/files`;
        this.SERVER_URL_UPLOAD_FILE = `${this.SERVER_URL}/api/v1/upload`;
        this.SERVER_URL_GET_FILE = `${this.SERVER_URL}/api/v1/file`;


        const defaultFileType = "pdf";
        this.uploadSuccessMessage = "Upload successfull!";
        this.uploadFailureMessage = "Upload failed. Try again later.";
        this.state = {
            fileType: defaultFileType,
            fileDownloadUrl: null,
            uploadStatusMessage: "No upload",
            uploadStatus: null,
            files: []
        }
        this.downloadFile = this.downloadFile.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.validateSize = this.validateSize.bind(this);


    }

    componentDidMount() {
        this.fetchApiToFiles(this.SERVER_URL_FETCH_FILES);
    }
    fetchApiToFiles = (apiToFetch) => {
        fetch(apiToFetch)
            .then(result => result.json())
            .then((files) => {
                this.setState({
                    ...this.state,
                    files
                })
            })
            .catch((error) => console.log(error));
    }

    uploadFile(event) {
        var file = event.target.files[0];
        if (this.validateSize(event)) {
            this.setState({ status: "In progress...." });
            // if return true allow to setState
            const data = new FormData()
            data.append('file', file)
            axios.post(this.SERVER_URL_UPLOAD_FILE, data)
                .then(res => { // then print response status
                    this.setState({ uploadStatusMessage: this.uploadSuccessMessage });
                    this.setState({ uploadStatus: true });
                    console.log('Upload is successful.', res);
                    this.fetchApiToFiles(this.SERVER_URL_FETCH_FILES); // get all documents that belong to user
                })
                .catch(err => { // then print response status
                    this.setState({ uploadStatus: `${this.uploadFailureMessage} Reason: ${err}` });
                    this.setState({ uploadStatus: false });
                    console.log('Upload failed', err);
                })
        }
    }

    validateSize(event) {
        let file = event.target.files[0];
        let size = 30000;
        let err = '';
        console.log(file.size);
        if (file.size > size) {
            err = file.type + 'is too large, please pick a smaller file\n';
            console.log(err);
        }
        return true
    }

    downloadFile(evt) {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        let fileName = evt.target.fileName;
        fetch(`${this.SERVER_URL_GET_FILE}/${fileName}/`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }


    render() {
        return (
            <div>
                <NavBar auth={true} />
                <div className="my-documents">
                    <header className="">
                        <p> 🚀 RapidSign 🚀<br></br> Blazingly Fast and Secure Document Signing Platform</p>
                    </header>

                    <h2>My Documents 📝</h2>
                    <p>You can see all the documents you created or received here.</p>
                    <table id="my-documents">
                        <thead>
                            <tr><th>Name</th><th>Description</th><th>URL</th><th>Created at</th><th>Last Modified</th></tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                    <div id="my-documents-list">⚠️ No documents created/received for this user ⚠️</div>

                    <hr className="rounded" />
                    <h2>Create New Document ✏️</h2>
                    <p>You can upload a document here so that others can sign it.</p>
                    <div className="upload-form-container">
                        <form method="post" action="#" id="#">
                            <span className="label-holder"><label for="name">File Name:</label></span>
                            <span className="input-holder"><input type="text" id="name" name="name" placeholder="File Name" /></span>

                            <span className="label-holder"><label for="description">Description:</label></span>
                            <span className="input-holder"><input type="text" id="description" name="description" placeholder="File Description" /></span>

                            <span className="label-holder"><label for="file">File</label></span>
                            <span className="input-holder"><input type="file" id="file" name="file" placeholder="Your Document" onChange={this.onChangeHandler} /></span>
                            {/* <div>
                        <button width="100%" type="button" onClick={this.fileUploadHandler}>Upload File</button>
                    </div> */}
                            <span className="label-holder"><label for="status">Upload Status:</label></span>
                            <span className="input-holder"><pre className="status">{this.state.status}</pre></span>
                        </form>

                    </div>
                </div>
            </div>
        )
    }
}

export default Manage;