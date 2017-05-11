'use strict';

const createError = require('http-errors');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path'); 
const del = require('del');
const AWS = require('aws-sdk');
const dataDir = `${__dirname}/../data`; 
const debug = require('debug')('cfgram:pic-routes');
const multer = require('multer');  
const upload = multer({dest: dataDir});  


const Pic = require('../models/pic.js');
const Gallery = require('../models/gallery.js');

AWS.config.setPromisesDependency(require('bluebird'));

module.exports = exports = {};

const s3 = new AWS.S3(); 

function s3UploadProm(params) {  
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      resolve(data);
    });
  });
}

exports.uploadPic = function(req) {
  debug('#POST /gallery/:id/pic');
  
  if(!req.file) return createError(400, 'Resouce required');
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
  });
};