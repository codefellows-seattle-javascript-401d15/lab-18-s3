'use strict';

const debug = require('debug')('cfgram:auth-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');
const createError = require('http-errors');
const Promise = require('bluebird');
const Controller = require('../controller/pic-control');

const dataDir = `${__dirname}/../data`;
const multer = require('multer');
const upload = multer({dest: dataDir});

module.exports = function(router) {

  router.post('/gallery/:galleryID/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST pic');
    console.log('WATTT');
    if(!req) return Promise.reject(createError(400, 'Bad Request'));
    Controller.postPic(req)
      .then(pic => res.status(201).json(pic))
      .catch(err => {
        console.log('ERR', err.name);
        res.status(err.status).send(err.name);
      });
  });

  router.get('/pic/:picID', bearerAuth, (req, res) => {
    debug('#GET pic');
    if(!req) return Promise.reject(createError(400, 'Bad Request'));
    Controller.getPic(req)
      .then(pic => res.status(201).json(pic))
      .catch(err => res.status(err.status).send(err.name));
  });

  router.delete('/pic/:picID', bearerAuth, (req, res) => {
    debug('#DELETE pic');
    if(!req) return Promise.reject(createError(400, 'Bad Request'));
    Controller.deletePic(req)
      .then(() => res.sendStatus(204))
      .catch(err => res.status(err.status).send(err.name));
  });

  return router;
};
