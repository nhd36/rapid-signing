// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const passport = require("passport");
const serveStatic = require('serve-static');
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

// Endpoints import
const home = require('./endpoints/home');
const login = require('./endpoints/login');
const register = require('./endpoints/register');

// Server setup
const app = express();

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Serve static assets (build folder) if in production	
if (process.env.NODE_ENV === "production") {
  app.use(serveStatic(path.join(__dirname, '..', 'client', 'dist')));
}

const port = process.env.PORT || 5000;

// Database setup
const { MONGODB } = require('./config/keys.js');

// connection
const conn = mongoose.createConnection(MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// mongoose
//   .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('MongoDB Connected');
//   })
//   .catch(error => {
//     console.log('MongoDB failed to connect with error:', error)
//   })

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
  url: MONGODB,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
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

// get / page
app.get(`/${API_VERSION}/`, (req, res) => {
  if (!gfs) {
    console.log("some error occured, check connection to db");
    res.send("some error occured, check connection to db");
    process.exit(0);
  }
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.json({ "files": false });
    } else {
      const f = files
        .map(file => {
          if (
            file.contentType === "image/png" ||
            file.contentType === "image/jpeg"
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
          return file;
        })
        .sort((a, b) => {
          return (
            new Date(b["uploadDate"]).getTime() -
            new Date(a["uploadDate"]).getTime()
          );
        });

      return res.json({ files: f });
    }

  });
});


// Post single file
app.post(`/${API_VERSION}/upload`, upload.single("file"), (req, res) => {
  res.redirect(`/${API_VERSION}`);
});

// Get all files
app.get(`/${API_VERSION}/files`, (req, res) => {
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exist"
      });
    }

    return res.json(files);
  });
});

// Get specific files
app.get(`/${API_VERSION}/files/:filename`, (req, res) => {
  gfs.find(
    {
      filename: req.params.filename
    },
    (err, file) => {
      if (!file) {
        return res.status(404).json({
          err: "no files exist"
        });
      }

      return res.json(file);
    }
  );
});

app.get(`/api/${API_VERSION}`, home);
app.post(`/api/${API_VERSION}/login`, login);
app.post(`/api/${API_VERSION}/register`, register);

// Server run
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});