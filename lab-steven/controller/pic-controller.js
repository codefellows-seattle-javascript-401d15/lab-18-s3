'use strict';

const debug = require('debug')('cfgram: pic-controller');
const createError = require('http-errors');
const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS  = require('aws-sdk');
const dataDir = `${__dirname}/../data`;


const Pic = require('../model/pic');
const Gallery = require('../model/gallery');

module.exports = exports = {};

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();

function s3UploadProm(params){
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) return reject(createError(err.status, err.name));
      return resolve(data);
    });
  });
}

function s3DeleteProm(params){
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) return reject(createError(err.status, err.name));
      return resolve(data);
    });
  });
}

exports.createPic = function(req){
  debug('#createPic');

  if(!req.file) return Promise.reject(createError(400, 'Resource required'));
  if(!req.file.path) return Promise.reject(createError(500, 'File not saved'));

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
  .then(pic => Promise.resolve(pic))
  .catch(err => Promise.reject(createError(err.status, err.name)));
};

exports.fetchPic = function(reqUser, picId){
  debug('#fetchPic');

  return Pic.findById(picId)
  .then(pic => pic)
  .catch(err => createError(err.status, err.name));
};

exports.deletePic = function(reqUser, picId){
  debug('#deletePic');

  return Pic.find({ _id: picId, userID: reqUser._id})
  .then(pic => {
    if (pic[0] === null) return Promise.reject(createError(404, 'Not found'));
    let params = {
      Bucket: process.env.AWS_BUCKET,
      Key: pic[0].objectKey,
    };
    return s3DeleteProm(params);
  })
  .then(() => Pic.findOneAndRemove({_id: picId, userID: reqUser._id}))
  .catch(err => createError(err.status, err.name));
};
