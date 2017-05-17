'use strict'

const createError = require('http-errors')
const Gallery = require('../models/gallery')
const debug = require('debug')('cfgram:gallery-routes')
const bearerAuth = require('../lib/bearer-auth-middleware')
const GalleryCtrl = require('../controllers/gallery-controller')

module.exports = function(router){
  router.post('/gallery', bearerAuth, (req,res) => {
    debug('#POST /api/gallery')
    GalleryCtrl.createGal(req.body, req.user._id,res)
  })

  router.get('/gallery/:id', bearerAuth, (req,res) => {
    debug('#GET /api/gallery/:id')
    GalleryCtrl.readGal(req.params.id, req.user._id, res)
  })

  router.put('/gallery/:id', bearerAuth, (req,res) => {
    debug('#PUT /api/gallery/:id')
    return GalleryCtrl.updateGal(rep.params.id, req.user._id, req.body)
      .then(gallery => res.gallery)
      .catch(err => res.status(err.status).send(err.message))
  })

  router.delete('/gallery/:id', bearerAuth, (req,res) => {
    debug('#DELETE /api/gallery/:id')
    GalleryCtrl.deleteGal(req.params.id, req.user._id, res)
  })
  return router
}
