'use strict';

const debug = require('debug')('cfgram:pic-routes');
const dataDir = `${__dirname}/../data`;
const bearerAuth = require('../lib/bearer-auth-middleware');
const multer = require('multer');
const upload = multer({dest: dataDir});

const picCtrl = require('../controllers/pic-controller');

module.exports = function(router) {

  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    console.log('In ROUTE for Pic Upload');
    debug('#POST /gallery/:id/pic');

    picCtrl.addPicToS3(req)
    .then(pic => res.json(pic))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/gallery/:id/pic/:id', bearerAuth, (req, res) => {
    debug('#GET /pic/:id');

    picCtrl.fetchPic(req, res)
    .then((pic) => res.send(pic))
    .catch((err) => res.send(err.message));

  });

  router.delete('/gallery/pic/:id', bearerAuth, (req, res) => {
    debug('#DELETE gallery/:id/pic/:id');

    picCtrl.removePicFromS3(req, res)
    .then((res) => res.send('Picture: ' + res._id + 'removed'))
    .catch((err) => res.send(err.message));
  });

  return router;
};
