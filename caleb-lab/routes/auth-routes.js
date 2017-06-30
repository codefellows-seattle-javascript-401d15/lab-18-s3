'use strict';

const debug = require('debug')('cfgram:auth-routes');
const basicAuth = require('../lib/basic-auth-middleware.js');
const userCtrl = require('../controllers/user-controller.js');

module.exports = function(router){
  router.post('/signup', (req, res) => {
    debug('POST /signup');
    return userCtrl.createUser(req.body)
    .then(token => res.json(token))
    .catch(err => res.status(err.status).send(err));
  });

  router.get('/signin', basicAuth, (req, res) => {
    debug('GET /signin');
    return userCtrl.fetchUser(req.auth)
    .then(token => res.json(token))
    .catch(err => res.status(400).send(err));
  });
  return router;
};
