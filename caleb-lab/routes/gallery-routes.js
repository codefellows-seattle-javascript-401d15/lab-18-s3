'use strict'

const debug = require('debug')('cfgram:gallery-routes.js')
const galleryCtrl = require('../controllers/gallery-controller.js')
const bearerAuth = require('../lib/bearer-auth-middleware.js')

module.exports = function(router){
  router.post('/gallery', bearerAuth, (req, res) => {
    debug('#POST /api/gallery')

    req.body.userId = req.user._id

    return galleryCtrl.createGallery(req.body)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message))
  })

  router.get('/gallery/:id', bearerAuth, (req, res) => {
    debug('GET /api/gallery/:id')
    return galleryCtrl.fetchGallery(req.params.id, req.user._id)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message))
  })

  router.put('/gallery/:id', bearerAuth, (req, res) => {
    debug('#PUT /api/gallery/:id')
    return galleryCtrl.updateGallery(req.params.id, req.body)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message))
  })

  router.delete('/gallery/:id', bearerAuth, (req, res) => {
    debug('DELETE /api/gallery/:id')
    return galleryCtrl.deleteGallery(req.params.id)
    .then(() => res.status(204).send())
    .catch(err => res.status(err.status).send(err.message))
  })
  return router
}
