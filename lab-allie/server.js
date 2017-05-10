'use strict';

require('dotenv').load();

const express = require('express');
const cors = require('cors');
const debug = require('debug')('cfgram:server');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const bodyParser = require('body-parser').json();
const errorHandler = require('./lib/error-middleware.js');

const app = module.exports = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/cfgram-dev';

const authRoutes = require('./routes/user-routes.js')(router);
const galleryRoutes = require('./routes/gallery-routes.js')(router);
const picRoutes = require('./routes/pic-routes.js')(router);

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(errorHandler);
app.use(cors());
app.use(bodyParser);
app.use('/api', authRoutes);
app.use('/api', galleryRoutes);
app.use('/api', picRoutes);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));