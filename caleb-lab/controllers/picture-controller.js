'use strict'

const debug = require('debug')('cfgram:picture-controller')
const createError = require('http-errors')
const path = require('path')
const fs = require('fs')
const del = require('del')
const AWS = require('aws-sdk')
const dataDir = `${__dirname}/../data`
const Promise = require('bluebird')

const Picture = require('../models/picture')
const Gallery = require('../models/gallery')

AWS.config.setPromisesDependency(require('bluebird'))

module.exports = exports = {}

const s3 = new AWS.S3()

function s3UploadProm(params){
  return new Promise((resolve, reject) => {
    s3.upload(params, (err,data) => {
      resolve(data)
    })
  })
  .catch(err => Promise.reject(err))
}

exports.postPicture = function(req){
  debug('#POST /picture/:galleryId')
  if(!req.file) return Promise.reject(createError(400, 'No target file found'))
  if(!req.file.path) return Promise.reject(createError(500, 'File upload unsuccessful'))

  let ext = path.extname(req.file.originalname)

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path),
  }
  return Gallery.findById(req.params.id)
  .then(() => s3UploadProm(params))
  .then(s3Data => {
    console.log('s3 data', s3Data);
    del([`${dataDir}/*`])
    let picData = {
      name: req.body.name,
      description: req.body.description,
      userId: req.user._id,
      galleryId: req.params.id,
      imageURI: s3Data.Location,
      objectKey: s3Data.Key,
    }
    return new Picture(picData).save()
  })
  .then(picture => picture)
  .catch(err => Promise.reject(err))
}

exports.deletePic = function(pictureId){
  debug('#DELETE /picture/:pictureId')
  if(!pictureId) return Promise.reject(createError(400, 'No targeted picture'))
  return Picture.findByIdAndRemove(pictureId)
  .then(picture => Promise.resolve(picture))
}
