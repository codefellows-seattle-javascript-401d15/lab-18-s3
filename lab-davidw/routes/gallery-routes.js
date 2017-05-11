'use strict';

const galleryCtrl = require('../controllers/gallery-controller');
const debug = require('debug')('cfgram:gallery-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');

module.exports = function(router) {

  router.post('/gallery', bearerAuth, (req, res) => {
    debug('#POST /api/gallery');
    galleryCtrl.createGallery(req, res, req.body, req.user._id);

  });

  router.get('/gallery/:id');
  debug('#GET /api/gallery/:id', bearerAuth, (req, res) => {
    galleryCtrl.fetchGallery(req, res, req.params.id, req.user._id);
  });

  router.delete('/gallery/:id', bearerAuth, (req, res) => {
    debug('#DELETE /api/gallery/:id');
    galleryCtrl.deleteGallery(req, res, req.params.id, req.user._id);

  });

  router.put('/gallery/:id', bearerAuth, (req, res) => {
    debug('#PUT /api/gallery/:id');
    galleryCtrl.updateGallery(req, res, req.params.id, req.user._id, req.body);
  });
  return router;
};
