'use strict';

const Promise = require('bluebird');
const createError = require('http-errors');
const Gallery = require('../models/gallery');
const Pic = require('../models/pic');
const fs = require('fs');
const del = require('del');
const path = require('path');
const AWS = require('aws-sdk');
const dataDir = `${__dirname}/../data`;
const multer = require('multer');

module.exports = exports = {};

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();

function s3UploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err,data) => {
      resolve(data);
    });
  });
}

exports.createItem = function(req) {
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
      userId: req.user._id,
      galleryId: req.params.id,
      imageURI: s3Data.Location,
      objectKey: s3Data.Key,
    };
    return new Pic(picData).save();
  })
  .then(pic => pic)
  .catch(err => Promise.reject(err));
};

exports.deleteItem = function(picId) {
  if(!picId) return Promise.reject(createError(400, 'pic id required'));

  return Pic.findByIdAndRemove(picId)
  .then(pic => {
    let params = {
      Bucket: process.env.AWS_BUCKET,
      Key: pic.objectKey,
    };
    return s3.deleteObject(params);
  })
  .catch(err => console.error(err))
  .then(pic => {
    Promise.resolve(pic);
  });
};
