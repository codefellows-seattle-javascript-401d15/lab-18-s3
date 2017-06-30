'use strict'

const picCtrl = require('../controllers/picture-controller')
const debug = require('debug')('cfgram:picture-model')
const Promise = require('bluebird')
const bearerAuth = require('../lib/bearer-auth-middleware')
const multer = require('multer')
const dataDir = `${__dirname}/../data`
const upload = multer({dest: dataDir})

module.exports = function(router){
  router.post('/picture/:galleryId', bearerAuth, upload.single('image'), (req, res) => {
    ('#POST picture')
    picCtrl.postPicture(req)
    .then(picture => res.json(picture))
    .catch(err => res.send(err.message))
  })

  router.delete('/picture/:pictureId', bearerAuth, (req, res) => {
    ('#DELETE picture')
    picCtrl.deletePic(req.params.pictureId)
    .then(err => res.status(204).send(err.message))
    .catch(err => res.send(err.message))
  })

  return router
}
