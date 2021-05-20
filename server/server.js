// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const passport = require("passport");
const serveStatic = require('serve-static');
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
var cors = require('cors')

// Endpoints import
const home = require('./endpoints/home');
const login = require('./endpoints/login');
const register = require('./endpoints/register');

// Server setup
const app = express();


// Serve static assets (build folder) if in production	
if (process.env.NODE_ENV === "production") {
  app.use(serveStatic(path.join(__dirname, '..', 'client', 'dist')));
}


// Passport middleware
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(cors())

// Passport config
require("./config/passport")(passport);

// Serve static assets (build folder) if in production	
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

// Database setup
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: __dirname + '/../.env' });
}


// connection
const conn = mongoose.createConnection(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(error => {
    console.log('MongoDB failed to connect with error:', error)
  })

// init gfs
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

// Storage
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


let API_VERSION = "v1";
// Endpoints setup
// Source: https://github.com/shubhambattoo/node-js-file-upload/blob/master/app.js
// Source: https://betech.info/mongodb-gridfs-file-upload-example-with-node-js/
// https://stackoverflow.com/questions/62265091/file-download-from-mongodb-atlas-to-clientreact-js-using-node-js

// Post single file
app.post(`/api/${API_VERSION}/upload`, upload.single('file'), (req, res) => {
  // console.log(req.file.originalname);
  res.json({ message: "success", file: req.file.originalname });
});


//show all files
app.get(`/api/${API_VERSION}/files`, (req, res) => {
  gfs.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        error: "No file exists"
      });
    }
    return res.json(files);
  });
});

//search files by original name
app.get(`/api/${API_VERSION}/file/:filename`, (req, res) => {
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
    return res.status(400).json({ message: 'Invalid filename' });
  }
});

app.get(`/api/${API_VERSION}`, home);
app.post(`/api/${API_VERSION}/login`, login);
app.post(`/api/${API_VERSION}/register`, register);

// Server run
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});