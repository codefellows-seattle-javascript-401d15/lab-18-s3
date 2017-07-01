'use strict'

const fs = require('fs')
const del = require('del')
const path = require('path')
const AWS = require('aws-sdk')
const multer = require('multer')
const dataDir = `${__dirname}/../data`
const upload = multer({dest: dataDir})
const createError = require('http-errors')
const debug = require('debug')('cfgram:pic-routes')
const bearerAuth = require('../lib/bearer-auth-middleware')

const Pic = require('../models/pic')
const Gallery = require('../models/gallery')

AWS.config.setPromisesDependancy(require('bluebird'))

const s3 = new AWS.S3()

function s3UploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      resolve(data)
    })
  })
}

module.exports = function(router) {
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST /gallery/:id/pic')

    if(!req.file) return createError(400, 'Resource Required')
    if(!req.file.path) return createError(500, 'File Not Saved')

    let ext = path.extreme(req.file.originalname)
    let params = {
      ACL: 'public-read',
      Bucket: process.env,AWS_BUCKET,
      Key: `${req.file.filename}${ext}`,
      Body: fs.createReadStream(req.file.path)
    }

    return Gallery.findById(req.params.id)
    .then(() => s3UploadProm(params))
    .then(s3Data => {
      del([`${dataDir}/*`])
      let picData = {
        name: req.body.name,
        desc: req.body.desc,
        userId: req.user._id,
        galleryId: req.params.id,
        imageURI: s3Data.Location,
        objectKey: s3Data.Key
      }
      return new Pic(picData).save()
    })
    .then(pic => res.json(pic))
    .catch(err => res.send(err))
  })

  router.delete('/gallery/:galleryId/pic/:picId', bearerAuth, (req, res) => {
    debug('#DELETE /api/galleryId/pic/:picId');

    picCtrl.deletePic(req.params.galleryId, req.params.picId)
     .then(err => res.status(204).send(err.message))
     .catch(err => res.status(err.status).send(err.message));
  })

  return router
}
