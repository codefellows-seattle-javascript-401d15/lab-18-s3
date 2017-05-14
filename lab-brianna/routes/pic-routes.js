'use strict';

const debug = require('debug')('cfgram:pic-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');
const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});
const picController = require('../controller/pic-controller');

module.exports = function(router) {
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST /gallery/:id/pic');

    picController.createPic(req)
    .then(pic => res.json(pic))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.delete('/gallery/:id/pic/:picId', bearerAuth, (req, res) => {
    debug('#GET /gallery/:id/pic/:pidId');

    return picController.deletePic(req)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(err.status).send(err.message));
  });

  return router;
};
