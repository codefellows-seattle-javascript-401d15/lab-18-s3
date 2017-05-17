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

const Pic  = require('../models/pic')
const Gallery = require('../models/gallery')
const picCtrl = require('../controllers/pic-controller')

AWS.config.setPromisesDependency(require('bluebird'))

const s3 = new AWS.S3()

function s3UploadProm(params){
  return new Promise((resolve, reject) => {
    s3.upload(params, (err,  data) => {
      reslove(data)
    })
  })
}

module.exports = function(router){
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req,res) => {
    debug('#POST /gallery/:id/pic')

    if(!req.file) return createError(400, 'Resource required')
    if(!req.file.path) return createError(500, 'File not saved')


    return picCtrl.createPic(req,s3UploadProm)
      .then(pic => res.json(pic))
      .catch(err => res.send(err))
  })

  router.get('/pic/:id', bearerAuth, (req,res) => {
    debug('#GET /pic/:id')

    return picCtrl.readPic(req)
      .then(img => res.json(img))
      .catch(err => res.status(err.status).send(err.message))

  })

  router.delete('/pic/:id', bearerAuth, (req,res) => {
    debug('#DELETE /pic/:id')

    return picCtrl.deletePic(req)
      .then(() => res.sendStatus(204))
      .catch(err => res.status(err.status).send(err.message))
  })

  return router
}
