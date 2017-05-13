'use strict';

const galleryCtrl = require('../controllers/gallery-controller');
const debug = require('debug')('cfgram:gallery-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');

module.exports = function(router) {

  router.post('/gallery', bearerAuth, (req, res) => {
    debug('#POST /api/gallery');

    galleryCtrl.createGallery(req)
    .then(gallery => res.json(gallery))
    .catch((err) => res.status(err.status).send(err.message));

  });

  router.get('/gallery/:id', bearerAuth, (req, res) => {
    debug('#GET /api/gallery/:id');

    return galleryCtrl.fetchGallery(req)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));

  });

  router.delete('/gallery/:id', bearerAuth, (req, res) => {
    debug('#DELETE /api/gallery/:id');
    return galleryCtrl.deleteGallery(req)
    .then(() => res.sendStatu(204))
    .catch(err => res.send(err.status).send(err.message));
  });

  router.put('/gallery/:id', bearerAuth, (req, res) => {
    debug('#PUT /api/gallery/:id');

    return galleryCtrl.updateGallery(req.params.id)
    .then(gallery => res.json(gallery))
    .catch(err => res.send(err.status).send(err.message));
  });

  return router;
};
