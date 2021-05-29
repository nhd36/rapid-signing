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
const { getDocument, getAllDocuments, createDocument, deleteDocument, lockDocument, unlockDocument } = require('./endpoints/document');
const { upload, getFile, uploadSingleFile, getAllFiles, searchByName } = require('./endpoints/files')

// Server setup
const app = express();

// Middleware configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use(cors())
app.use(passport.initialize());
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
app.post(`/api/${API_VERSION}/create-document`,  passport.authenticate("jwt", { session: false }), upload.single('file'), createDocument);
app.get(`/api/${API_VERSION}/documents`, passport.authenticate("jwt", { session: false }),  getAllDocuments);
app.get(`/api/${API_VERSION}/document/:id`, passport.authenticate("jwt", { session: false }),  getDocument);
app.delete(`/api/${API_VERSION}/delete-document/:id`, passport.authenticate("jwt", { session: false }), deleteDocument);
app.post(`/api/${API_VERSION}/lock-document/:id`,  passport.authenticate("jwt", { session: false }), lockDocument);
app.post(`/api/${API_VERSION}/unlock-document/:id`,  passport.authenticate("jwt", { session: false }), unlockDocument);
app.post(`/api/${API_VERSION}/upload`,  passport.authenticate("jwt", { session: false }), upload.single('file'), uploadSingleFile);
app.get(`/api/${API_VERSION}/files`,  passport.authenticate("jwt", { session: false }), getAllFiles);
app.post(`/api/${API_VERSION}/file/search/:filename`,  passport.authenticate("jwt", { session: false }), searchByName);
app.get(`/api/${API_VERSION}/file/:id`,  passport.authenticate("jwt", { session: false }), getFile);

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