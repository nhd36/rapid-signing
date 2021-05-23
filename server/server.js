// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const passport = require("passport");
const path = require("path");
var cors = require('cors')

// Endpoints import
const home = require('./endpoints/home');
const login = require('./endpoints/login');
const register = require('./endpoints/register');
const { getDocument, createDocument, deleteDocument, lockDocument, unlockDocument } = require('./endpoints/document');
const { upload, uploadSingleFile, getAllFiles, searchByName } = require('./endpoints/files')

// Server setup
const app = express();

// Passport middleware
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(cors())

// Passport config
require("./config/passport")(passport);

const port = process.env.PORT || 5000;

// Environment variables configuration
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: __dirname + '/../.env' });
}

mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(error => {
    console.log('MongoDB failed to connect with error:', error)
  })

  // Endpoints configuration
let API_VERSION = "v1";
app.get(`/api/${API_VERSION}`, home);
app.post(`/api/${API_VERSION}/login`, login);
app.post(`/api/${API_VERSION}/register`, register);
app.post(`/api/${API_VERSION}/create-document`, upload.single('file'), createDocument);
app.get(`/api/${API_VERSION}/document/:id`, getDocument);
app.delete(`/api/${API_VERSION}/delete-document/:id`, deleteDocument);
app.post(`/api/${API_VERSION}/lock-document/:id`, lockDocument);
app.post(`/api/${API_VERSION}/unlock-document/:id`, unlockDocument);
app.post(`/api/${API_VERSION}/upload`, upload.single('file'), uploadSingleFile);
app.get(`/api/${API_VERSION}/files`, getAllFiles);
app.post(`/api/${API_VERSION}/file/:filename`, searchByName);

// Serve static assets (build folder) if in production	
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}


// Server run
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});