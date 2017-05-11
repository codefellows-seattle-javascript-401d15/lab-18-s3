'use strict';

const fs = require('fs');
const del = require('del');
const path = require('path');
const AWS = require('aws-sdk');
const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});
const createError = require('http-errors');
const debug = require('debug')('cfgram:pic-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');
const Pic = require('../models/pic');
const Gallery = require('../models/gallery');
const picController = require('../controllers/pic-controller');

AWS.config.setPromisesDependency(require('bluebird'));

module.exports = function(router) {
  
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST /gallery/:id/pic');
    picController.createItem(req)
    .then(pic => res.json(pic))
    .catch(err => res.send(err));
  });

  router.get('/pic/:id', bearerAuth, (req, res) => {
    debug('#GET /pic/:id');
  });

  return router;
};
