'use strict';

const createError = require('http-errors');
const galleryController = require('../controllers/gallery-controller');
const debug = require('debug')('cfgram:gallery-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');

module.exports = function(router) {

  router.post('/gallery', bearerAuth, (req, res) => {
    debug('#POST /api/gallery');
    galleryController.createItem(req, res, req.body, req.user._id);

  });

  router.get('/gallery/:id', bearerAuth, (req, res) => {
    debug('#GET /api/gallery/:id');
    galleryController.fetchItem(req, res, req.params.id, req.user._id);
  });

  router.delete('/gallery/:id', bearerAuth, (req, res) => {
    debug('#DELETE /api/gallery/:id');
    galleryController.deleteItem(req, res, req.params.id, req.user_id);
  });

  router.put('/gallery/:id', bearerAuth, (req, res) => {
    debug('#PUT /api/gallery/:id');
    galleryController.updateItem(req, res, req.params.id, req.user._id, req.body);

  });
  return router;
};
