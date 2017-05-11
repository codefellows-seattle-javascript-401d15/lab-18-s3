'use strict';

const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});
const debug = require('debug')('cfgram:pic-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');

const picCtrl = require('../controllers/pic-controller');

module.exports = function(router) {
  
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST /gallery/:id/pic');
    picCtrl.addPicToS3(req, res)
    .then((pic) => res.send(pic))
    .catch((err) => res.send(err.message));

  });

  router.get('/pic/:id', bearerAuth, (req, res) => {
    debug('#GET /pic/:id');
    picCtrl.fetchPic(req, res)
    .then((pic) => res.send(pic))
    .catch((err) => res.send(err.message));

  });

  router.delete('/pic/:id', bearerAuth, (req, res) => {
    debug('#DELETE /pic/:id');
    picCtrl.removePicFromS3(req, res)
    .then((res) => res.send('Picture: ' + res._id + 'removed'))
    .catch((err) => res.send(err.message));
  });

  return router;
};
