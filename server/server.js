// Dependencies
const express = require('express');
const mongoose = require('mongoose')
const path = require('path')
const passport = require("passport");
const serveStatic = require('serve-static');

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
  app.use(serveStatic(path.join(__dirname, '..','client','dist')));
}

const port = process.env.PORT || 5000;

// Database setup
const { MONGODB } = require('./config/keys.js');
mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {

    console.log('MongoDB Connected');
  })
  .catch(() => {
    console.log('MongoDB failed to connect')
  })

let API_VERSION = "v1";

// Endpoints setup
app.get(`/api/${API_VERSION}`, home);
app.post(`/api/${API_VERSION}/login`, login);
app.post(`/api/${API_VERSION}/register`, register);

// Server run
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});