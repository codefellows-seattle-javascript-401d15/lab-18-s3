'use strict';

const createError = require('http-errors');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path'); 
const del = require('del');
const AWS = require('aws-sdk');
const dataDir = `${__dirname}/../data`; 
const debug = require('debug')('cfgram:pic-routes');


const Pic = require('../models/pic.js');
const Gallery = require('../models/gallery.js');

AWS.config.setPromisesDependency(require('bluebird'));

module.exports = exports = {};

const s3 = new AWS.S3(); 

function s3UploadProm(params) {  
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      console.log(err);
      resolve(data);
    });
  })
  .catch(err => Promise.reject(err));
}

exports.uploadPic = function(req) {
  debug('#POST /gallery/:id/pic');
  
  if(!req.file) return Promise.reject(createError(400, 'Resouce required'));
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
    console.log('s3Data', s3Data);

    del([`${dataDir}/*`]);
    let picData = {
      name: req.body.name,
      description: req.body.description,
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

exports.deletePic = function(picid) {
  if(!picid) return Promise.reject(createError(400, 'Pic ID required'));
  
  debug('#DELETE /gallery/:id/pic/:id');
  console.log('req', picid);
  // if(!req.file) return Promise.reject(createError(400, 'Resouce required'));
  // if(!req.file.path) return Promise.reject(createError(500, 'File not saved'));
  
  // let ext = path.extname(req.file.originalname);
  
  return Pic.findByIdAndRemove(picid)
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


// //from lab repo
// var params = {
//   Bucket: 's3-bucket-name',
//   Key: 'object-filename'
// }
// s3.deleteObject(params)
// 
// 
// //from amazon
// var params = {
//   Bucket: 'STRING_VALUE', /* required */
//   Key: 'STRING_VALUE', /* required */
//   MFA: 'STRING_VALUE',
//   RequestPayer: requester,
//   VersionId: 'STRING_VALUE'
// };
// s3.deleteObject(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });