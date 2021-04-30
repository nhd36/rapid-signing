import React from 'react';
import "./HandleDocument.css"

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
            status: ""
        }
        this.download = this.download.bind(this);
        this.upload = this.upload.bind(this);
        this.openFile = this.openFile.bind(this);
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


    upload() {
        this.dofileUpload.click()
    }

    /**
     * Process the file within the React app. We're NOT uploading it to the server!
     */
    openFile(evt) {
        let status = []; // Status output
        const fileObj = evt.target.files[0];
        const reader = new FileReader();

        let fileloaded = e => {
            // e.target.result is the file's content as text
            const fileContents = e.target.result;
            status.push(`File name: "${fileObj.name}". Length: ${fileContents.length} bytes.`);
            // Show first 80 characters of the file
            const first80char = fileContents.substring(0, 80);
            status.push(`First 80 characters of the file:\n${first80char}`)
            this.setState({ status: status.join("\n") })
        }

        // Mainline of the method
        fileloaded = fileloaded.bind(this);
        reader.onload = fileloaded;
        reader.readAsText(fileObj);
    }

    render() {
        return (
            <div>
                <h2>Upload your document</h2>
                <form>

                    <a className="hidden"
                        download={this.fileNames[this.state.fileType]}
                        href={this.state.fileDownloadUrl}
                        ref={e => this.dofileDownload = e}
                    >download it</a>

                    <p><button onClick={this.upload}>
                        Upload a file!
                    </button> Only pdf files are ok.</p>

                    <input type="file" className="hidden"
                        multiple={false}
                        accept=".pdf,application/json"
                        onChange={evt => this.openFile(evt)}
                        ref={e => this.dofileUpload = e}
                    />
                </form>
                <pre className="status">{this.state.status}</pre>
            </div>
        )
    }
}

export default HandleDocument;
