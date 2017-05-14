'use strict';

const AWS = require('aws-sdk');
const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});
const debug = require('debug')('cfgram:pic-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');
const picController = require('../controllers/pic-controller');

module.exports = function(router) {

  router.post('/gallery/:id/pic', bearerAuth, upload.single('pic'), (req, res) => {
    debug('#POST /gallery/:id/pic');
    picController.createItem(req)
    .then(pic => {
      return res.json(pic);
    })
    .catch(err => res.send(err));
  });

  router.delete('/gallery/:galleryid/pic/:picid', bearerAuth, (req, res) => {
    debug('#DELETE /gallery/:id/pic/:id');
    picController.deleteItem(req.params.picid)
    .then(err => res.status(204).send(err.message))
    .catch(err => res.send(err));
  });

  return router;
};
