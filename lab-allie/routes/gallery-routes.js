'use strict';

const galleryCtrl = require('../controller/gallery-controller.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const debug = require('debug')('cfgram:user-model');

module.exports = function(router) {
  router.post('/gallery', bearerAuth, (req, res) => {
    debug('#POST /api/gallery');
    galleryCtrl.addPicture(req)
    .then(gallery => res.json(gallery))
    .catch(err => res.status(err.status).send(err.message));
  });
  
  router.get('/gallery/:id', bearerAuth, (req, res) => {
    debug('#GET /api/gallery/:id');
    galleryCtrl.getPicture(req)
    .then(gallery => res.json(gallery))
    .catch(err => {
      console.log(err);
      res.status(err.status).send(err.message);
    });  
  });
  
  router.put('/gallery/:id', bearerAuth, (req, res) => {
    debug('#PUT /api/gallery/:id');
    galleryCtrl.updatePicture(req)
    .then(pic => res.json(pic))
    .catch(err => res.status(err.status).send(err.message));
  });
  
  router.delete('/gallery/:id', bearerAuth, (req, res) => {
    debug('#DELETE /api/gallery/:id');
    galleryCtrl.deletePicture(req, res, req.params.id)
    .then(() => res.status(204).send())
    .catch(err => res.send(err));
  });
  
  return router;
};