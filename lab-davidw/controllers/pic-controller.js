'use strict';

const fs = require('fs');
const Promise = require('bluebird');
const Pic = require('../models/pic');
const Gallery = require('../models/gallery');
const del = require('del');
const dataDir = `${__dirname}/../data`;
const AWS = require('aws-sdk');
const path = require('path');
const createError = require('http-errors');
const s3 = new AWS.S3();

AWS.config.setPromisesDependency(require('bluebird'));

module.exports = exports = {};

function s3UploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      resolve(data);
    });
  });
}


exports.addPicToS3 = function(req) {
  console.log('FILE', req.file);
  if(!req.file) return createError(400, 'Resource required');
  if(!req.file.path) return createError(500, 'File not saved');

  let ext = path.extname(req.file.originalname);
  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path),
  };

  return Gallery.findById(req.params.id)
  .then(() => s3UploadProm(params))
  .then(s3Data => {
    del([`${dataDir}/*`]);
    let picData = {
      name: req.body.name,
      desc: req.body.desc,
      userID: req.user._id,
      galleryID: req.params.id,
      imageURI: s3Data.Location,
      objectKey: s3Data.Key,
    };

    return new Pic(picData).save();
  })
  .then(pic => pic)
  .catch(err => Promise.reject(err));
};

exports.fetchPic = function(req) {
  console.log('Here is the auth: ', req.auth);
  if(!req.auth) return Promise.reject(createError(404, 'No Authorization found'));
};

exports.removePicFromS3 = function(req) {
  if(!req._id) return Promise.reject(createError(400, 'Id is required'));
};
