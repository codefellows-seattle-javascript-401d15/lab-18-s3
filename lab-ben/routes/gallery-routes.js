'use strict';

const createError = require('http-errors');
const galleryCtrl = require('../controllers/gallery-controller.js');
const debug = require('debug')('cfgram:gallery-routes');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

module.exports = function(router) {
  router.post('/gallery', bearerAuth, (req, res) => {
    debug('#POST /api/gallery');

    galleryCtrl.addGallery(req)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/gallery/:id', bearerAuth, (req, res) => {
    debug('#GET /api/gallery');

    galleryCtrl.findGallery(req.params.id)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.put('/api/gallery/:id', bearerAuth, (req, res) => {
    debug('#PUT /api/gallery');

    galleryCtrl.updateGallery(req.params.id, req.body)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.delete('/api/gallery/:id', bearerAuth, (req, res) => {
    galleryCtrl.removeGallery(req.params.id)
    .then(() => res.json('item removed'))
    .catch(err => res.status(err.status).send(err.message));
  });
  return router;
};
