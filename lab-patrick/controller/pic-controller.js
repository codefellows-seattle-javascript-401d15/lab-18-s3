'use strict';

const fs = require('fs');
const del = require('del');
const path = require('path');
const AWS  = require('aws-sdk');
// const multer = require('multer');
const dataDir = `${__dirname}/../data`;
// const upload = multer({dest: dataDir});
const createError = require('http-errors');

const Pic = require('../models/pic');
const Gallery = require('../models/gallery');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();


function s3UploadProm(params) {
  return new Promise((resolve, reject) => {
    if(!params) return reject(new Error('params required'));
    s3.upload(params, (err, data) => {
      resolve(data);
    });
  });
}

module.exports = exports ={};

exports.createItem =function(req){

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
  });
};

// router.delete('/gallery/:id/pic/:picid', bearerAuth, (req, res)=>{

  // return Pic.findByIdAndRemove(req.params.id)
  // .then(pic =>{
  //   console.log(pic);
  //   let params = {
  //     Bucket: process.env.AWS_BUCKET,
  //     Key :pic.objectKey,
  //   };
  //   return s3.deleteObject(params);
  // })
  // .then(pic => Promise.resolve(pic))
  // .catch(err => res.status(err.status).send(err.message));
// });
