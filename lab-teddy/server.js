'use strict';

require('dotenv').load();

const express = require('express');
const cors = require('cors');
const Promise = require('bluebird');
const errorHandler = require('./lib/err-middleware');
const authRoutes = require('./route/auth-routes');
const galleryRoutes = require('./route/gallery-routes');
const picRoutes = require('./route/pic-route');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/cfgram-dev';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(errorHandler);
app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRoutes(router));
app.use('/api', galleryRoutes(router));
app.use('/api', picRoutes(router));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
