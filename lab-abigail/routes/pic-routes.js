'use strict';

const AWS = require('aws-sdk');
const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});
const debug = require('debug')('cfgram:pic-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');
const picController = require('../controllers/pic-controller');

AWS.config.setPromisesDependency(require('bluebird'));

module.exports = function(router) {

  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST /gallery/:id/pic');
    picController.createItem(req)
    .then(pic => res.json(pic))
    .catch(err => res.send(err));
  });

  // router.get('/pic/:id', bearerAuth, (req, res) => {
  //   debug('#GET /pic/:id');
  // });

  return router;
};
