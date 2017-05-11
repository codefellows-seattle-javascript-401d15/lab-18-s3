'use strict'

const Pic = require('../models/pic')
const mongoose = require('mongoose')
const dataDir = `${__dirname}/../data`
const multer = require('multer')
const upload = require({dest: dataDir})
const del = require('del')
const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')

module.exports = exports = {}

exports.createPic = function(req,s3upload){

  let ext = path.extname(req.file.originalname)
  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.creteReadStream(req.file.path)
  }

  return Gallery.findById(req.params.id)
    .then(() => s3upload(params))
    .then(s3Data => {
      del([`${dataDir}/*`])
      let picData = {
        name: req.body.name,
        desc: req.body.desc,
        userID: req.user._id,
        galleryID: req.params.id,
        imageURI: s3Data.Location,
        objectKey: s3Data.Key
      }
      return new Pic(picData).save()
    })
}
