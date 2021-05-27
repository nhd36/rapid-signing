// Dependencies
const crypto = require("crypto");
const mongoose = require('mongoose');
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
const { ObjectId } = require('mongodb');

// Environment variables configuration
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: __dirname + '../../../.env' });
}

// GridFsStorage configuration
let gfs;
const conn = mongoose.createConnection(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

conn.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

const storage = new GridFsStorage({
    url: process.env.MONGODB,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                /*const filename = buf.toString("hex") + path.extname(file.originalname);*/
                const filename = file.originalname;
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage
});
// Endpoints setup
// Source: https://github.com/shubhambattoo/node-js-file-upload/blob/master/app.js
// Source: https://betech.info/mongodb-gridfs-file-upload-example-with-node-js/
// Source: https://stackoverflow.com/questions/62265091/file-download-from-mongodb-atlas-to-clientreact-js-using-node-js

// Post single file
function uploadSingleFile(req, res) {
    console.log("req.file", req.file);
    res.json({ success: true, id: req.file.id, file: req.file.originalname });
};

// Get single file given id
function getFile(req, res) {
    res.set('content-type', 'application/pdf');
    res.set('accept-ranges', 'bytes');
    try {
        var downloadStream = gfs.openDownloadStream(ObjectId(req.params.id));

        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });

        downloadStream.on('error', (error) => {
            console.log("Inside downloadStream.on(error)", error)
            res.sendStatus(404);
        });

        downloadStream.on('end', () => {
            res.end();
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid file id' });
    }
};

//show all files
function getAllFiles(req, res) {
    gfs.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                error: "No file exists"
            });
        }
        return res.json(files);
    });
};

//search files by original name
function searchByName(req, res) {
    console.log("Received filename is", req.params.filename);
    res.set('content-type', 'application/pdf');
    res.set('accept-ranges', 'bytes');
    try {
        const downloadStream = gfs.openDownloadStreamByName(req.params.filename);

        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });

        downloadStream.on('error', () => {
            res.sendStatus(404);
        });

        downloadStream.on('end', () => {
            res.end();
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid filename' });
    }
};


module.exports = { upload, getFile, uploadSingleFile, getAllFiles, searchByName }