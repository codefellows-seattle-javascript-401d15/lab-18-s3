'use strict';

const createError = require('http-errors');
const Controller = require('../controller/gallery-control');
const debug = require('debug')('cfgram:gallery-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');

module.exports = function(router) {
  router.post('/gallery', bearerAuth, (req, res) => {
    debug('#POST /api/gallery');
    Controller.createGallery(req.body, req.user)
      .then(gallery => res.status(201).json(gallery))
      .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/gallery/:id', bearerAuth, (req, res) => {
    debug('#GET /api/gallery/:id');
    Controller.fetchGallery(req)
      .then(gallery => res.status(200).json(gallery))
      .catch(err => res.status(err.status).send(err.message));
  });
  router.get('/gallery', (req, res) => {
    debug('#GET /api/gallery');
    Controller.fetchAll(req)
      .then(gallery => res.status(200).json(gallery))
      .catch(err => res.status(err.status).send(err.message));
  });

  router.put('/gallery/:id', bearerAuth, (req, res) => {
    if(!req.body) return Promise.reject(createError(400, 'Bad Request'));
    Controller.updateGallery(req)
      .then(gallery => res.status(200).json(gallery))
      .catch(err => res.status(err.status).send(err.message));
  });

  router.delete('/gallery/:id', bearerAuth, (req, res) => {
    Controller.deleteGallery(req)
      .then(() => res.sendStatus(204))
      .catch(err => res.status(err.status).send(err.message));
  });
  return router;
};
