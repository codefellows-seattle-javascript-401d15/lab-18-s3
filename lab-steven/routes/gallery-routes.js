'use strict';

// const createError = require('http-errors');
const debug = require('debug')('cfgram:gallery-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');
const galCtrlr = require('../controller/gallery-controller');

module.exports = function(router){
  router.post('/gallery', bearerAuth, (req, res) => {
    debug('#POST /api/gallery');

    return galCtrlr.createGal(req.body, req.user)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));

  });

  router.get('/gallery/:id', bearerAuth, (req, res) => {
    debug('#GET /api/gallery/:id');

    return galCtrlr.fetchGal(req.user, { _id : req.params.id})
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));

  });

  router.put('/gallery/:id', bearerAuth, (req, res) => {
    debug('#PUT /api/gallery/:id');

    return galCtrlr.updateGal(req.body, req.params.id, req.user._id)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));

  });

  router.delete('/gallery/:id', bearerAuth, (req, res) => {
    debug('#DELETE /api/gallery/:id');

    return galCtrlr.deleteGal(req.params.id, req.user._id)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(err.status).send(err.message));
  });
  return router;
};
