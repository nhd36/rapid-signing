import React from 'react';
import "./HandleDocument.css"
const axios = require("axios");

class HandleDocument extends React.Component {
    constructor(props) {
        super(props)

        const defaultFileType = "json";
        this.fileNames = {
            json: "states.json"
        }
        this.state = {
            fileType: defaultFileType,
            fileDownloadUrl: null,
            status: "No upload"
        }
        this.download = this.download.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.validateSize = this.validateSize.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);

    }

    download(event) {
        event.preventDefault();
        // Prepare the file
        let output;
        if (this.state.fileType === "pdf") {
            output = JSON.stringify({ states: this.state.data },
                null, 4);
        }
        // Download it
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        this.setState({ fileDownloadUrl: fileDownloadUrl },
            () => {
                this.dofileDownload.click();
                URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
                this.setState({ fileDownloadUrl: "" })
            })
    }

    onChangeHandler(event) {
        var file = event.target.files[0];
        let UPLOAD_URL = "http://localhost:5000/v1/files";
        if (this.validateSize(event)) {
            this.setState({ status: "In progress...." });
            // if return true allow to setState
            const data = new FormData()
            data.append('file', file)
            axios.post(UPLOAD_URL, data)
                .then(res => { // then print response status
                    this.setState({ status: "Upload successfull" });
                    console.log('Upload is successful.', res);
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

    uploadFile(evt) {
        var formdata = new FormData();
        formdata.append("file", evt.target.files[0]);
        let UPLOAD_URL = "http://localhost:5000/v1/files";

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch(UPLOAD_URL, requestOptions)
            .then(response => response.text())
            .then(result => {
                this.setState({ status: "Upload successfull." });
                console.log(result)
            })
            .catch(error => {
                this.setState({ status: "Upload failed. Try again later." });
                console.log('error', error)
            });
    }
    render() {
        return (
            <div>
                <form method="post" action="#" id="#">
                    <p>Upload Your Document:</p>
                    <input width="100%" type="file" name="file" onChange={this.onChangeHandler} />
                    {/* <div>
                        <button width="100%" type="button" onClick={this.fileUploadHandler}>Upload File</button>
                    </div> */}
                </form>
                <pre className="status">{this.state.status}</pre>
            </div>
        )
    }
}

export default HandleDocument;
