import React from 'react';
import "./Manage.css"

const axios = require("axios");

class Manage extends React.Component {
    constructor(props) {
        super(props)
        const defaultFileType = "pdf";
        this.state = {
            fileType: defaultFileType,
            fileDownloadUrl: null,
            status: "No upload",
            files: []
        }
        this.downloadFile = this.downloadFile.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.validateSize = this.validateSize.bind(this);
        this.renderTableData = this.renderTableData.bind(this);
        this.renderTableHeader = this.renderTableHeader.bind(this);


    }
    componentDidMount() {
        this.fetchApiToEntries('http://localhost:5000/api/v1/files');
    }
    fetchApiToEntries = (apiToFetch) => {
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
        let UPLOAD_URL = "http://localhost:5000/api/v1/upload";
        if (this.validateSize(event)) {
            this.setState({ status: "In progress...." });
            // if return true allow to setState
            const data = new FormData()
            data.append('file', file)
            axios.post(UPLOAD_URL, data)
                .then(res => { // then print response status
                    this.setState({ status: "Upload successfull" });
                    console.log('Upload is successful.', res);
                    this.fetchApiToEntries('http://localhost:5000/api/v1/files');
                })
                .catch(err => { // then print response status
                    this.setState({ status: "Upload failed. Try again later." });
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
    };


    renderTableHeader() {
        let header = Object.keys(this.state.files[0])
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.files.map((file, index) => {
            const { _id, uploadDate, filename } = file //destructuring 
            return (
                <tr key={_id}>
                    <td>{_id}</td>
                    <td>{filename}</td>
                    <td>{uploadDate}</td>
                </tr>
            )
        })
    }

    downloadFile(evt) {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        let DOWNLOAD_URL = "http://localhost:5000/api/v1/file";
        let fileName = evt.target.fileName;
        fetch(`${DOWNLOAD_URL}/${fileName}/`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    render() {
        const { files } = this.state;
        console.log(files);
        return (
            <div>
                <div className="my-documents">
                    <header className="placeholder">
                        <p> 🚀 RapidSign 🚀<br></br> Blazingly Fast and Secure Document Signing Platform</p>
                    </header>

                    <h2>My Documents 📝</h2>
                    <p>You can see all the documents you created or received here.</p>
                    <table id="my-documents">
                        <tbody>
                            {this.renderTableData()}
                        </tbody>
                    </table>

                    <div id="my-documents-list" style={{visibility: this.state.files.length ? 'hidden' : 'visible' }}>⚠️ No documents created/received for this user ⚠️</div>

                    <hr className="rounded" />
                    <h2>Create New Document ✏️</h2>
                    <p>You can upload a document here so that others can sign it.</p>
                    <div className="upload-form-container">
                        <form method="post" action="#" id="#">
                            <span className="label-holder"><label htmlFor="name">File Name:</label></span>
                            <span className="input-holder"><input type="text" id="name" name="name" placeholder="File Name" /></span>

                            <span className="label-holder"><label htmlFor="description">Description:</label></span>
                            <span className="input-holder"><input type="text" id="description" name="description" placeholder="File Description" /></span>

                            <span className="label-holder"><label htmlFor="file">File</label></span>
                            <span className="input-holder"><input type="file" id="file" name="file" placeholder="Your Document" onChange={this.uploadFile} /></span>

                            <span className="label-holder"><label htmlFor="status">Upload Status:</label></span>
                            <span className="input-holder"><pre className="status">{this.state.status}</pre></span>
                        </form>

                    </div>
                </div>
            </div>
        )
    }
}

export default Manage;
