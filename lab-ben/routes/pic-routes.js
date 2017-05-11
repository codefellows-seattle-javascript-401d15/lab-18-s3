'use strict';

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});
const createError = require('http-errors');
const debug = require('debug')('cfgram:pic-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');

const Pic = require('../models/pic.js');
const Gallery = require('../models/gallery.js');
const picCtrl = require('../controllers/pic-controller.js');

AWS.config.setPromisesDependency(require('bluebird'));



module.exports = function(router) {
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST /api/gallery/:id/pic');

    if(!req.file) return createError(400, 'Resource required');
    if(!req.file.path) return createError(500, 'File not saved');

    let ext = path.extname(req.file.originalname);
    let params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: `${req.file.filename}${ext}`,
      Body: fs.createReadStream(req.file.path),
    };

    return picCtrl.uploadImg(req, params)
    .then(pic => res.json(pic))
    .catch(err => res.send(err));
  });

  router.delete('/gallery/:id/pic/:picID', bearerAuth, (req, res) => {
    debug('#DELETE /api/gallery/:id/pic/:picID');

    let pic = Gallery.findById(req.params.id).findByID(req.params.picID);
    let params = {
      Bucket: pic.Bucket,
      Key: pic.Key,
    };

    return picCtrl.removeImg(req, params)
    .then(() => res.json())
    .catch(err => res.send(err));
  });

  return router;
};
