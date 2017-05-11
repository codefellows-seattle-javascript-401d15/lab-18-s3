'use strict';

const del = require('del');
const AWS = require('aws-sdk');
const dataDir = `${__dirname}/../data`;
const debug = require('debug')('cfgram:pic-controller');

const Pic = require('../models/pic.js');
const Gallery = require('../models/gallery.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();

function s3UploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if(err) reject(err);
      resolve(data);
    });
  });
}

function s3DeleteProm(params) {
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if(err) reject(err);
      resolve(data);
    });
  });
}

module.exports = exports = {};

exports.uploadImg = function(req, params) {
  debug('pic-Controller #upload');

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
  });
};

exports.removeImg = function(req, params) {
  return Gallery.findById(req.params.id)
  .then(() => s3DeleteProm(params))
  .then(gallery => gallery.save());
};
