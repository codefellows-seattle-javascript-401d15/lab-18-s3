
const fs = require('fs');
const del = require('del');
const path = require('path');
const AWS = require('aws-sdk');
const dataDir = `${__dirname}/../data`;
const createError = require('http-errors');
const debug = require('debug')('cfgram:pic-routes');

const Pic = require('../model/pic');
const Gallery = require('../model/gallery');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();

function s3UploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      resolve(data);
    });
  });
}

function s3DeleteProm(params) {
  console.log('fuck');
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      return resolve(data);
    });
  });
}

module.exports = exports = {};

exports.postPic = function(req) {
  debug('#POST /gallery/:id/pic');
  console.log('HERRRE');
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
      galleryID: req.params.galleryID,
      imageURI: s3Data.Location,
      objectKey: s3Data.Key,
    };
    console.log(picData);
    return new Pic(picData).save();
  })
  .then(pic => {
    console.log(pic);
    return pic;
  });
};

exports.getPic = function(req) {
  debug('#GET /pic/:picID');
  Pic.findById(req.params.picID)
    .then(pic => pic);
};

exports.deletePic = function(req) {
  console.log('YOOOO');
  return Pic.findById(req.params.picID)
    .then(pic => {
      let params = {
        Bucket: process.env.AWS_BUCKET,
        Key: pic.objectKey,
      };
      return Pic.findByIdAndRemove(pic._id)
      .then(() => {
        s3DeleteProm(params);
      });
    });
};
