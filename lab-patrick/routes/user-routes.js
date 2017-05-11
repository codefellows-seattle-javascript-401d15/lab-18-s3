
'use strict';

const basicAuth = require('../lib/basic-auth-middleware');
const authController = require('../controller/user-controller');

module.exports = function(router) {
  router.post('/signup', (req, res) => {
    authController.createItem(req, res, req.body)
    .then(token => res.json(token))
    .catch( err => res.status(err.status).send(err.message));

  });

  router.get('/signin', basicAuth, (req, res) => {
    authController.fetchItem(res, req.auth)
    .then(token => res.json(token))
    .catch( err => res.status(err.status).send(err.message));
  });
  return router;
};
