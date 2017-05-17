'use strict';

const debug = require('debug')('cfgram: picRoutes');
const bearerAuth = require('../lib/bearer-auth-middleware');
const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});

const picCtrlr = require('../controller/pic-controller');

module.exports = function(router){
  debug('#pic-routes');

  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST gallery/:id/pic');

    return picCtrlr.createPic(req)
    .then(pic => res.json(pic))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.get('/pic/:id', bearerAuth, (req, res) => {
    debug('#GET /pic/:id');

    return picCtrlr.fetchPic(req.user, req.params.id)
    .then(data => res.json(data))
    .catch(err => res.status(err.status).send(err.message));
  });

  router.delete('/pic/:id', bearerAuth, (req, res) => {
    debug('#DELETE /pic/:id');

    return picCtrlr.deletePic(req.user, req.params.id)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(err.status).send(err.message));
  });
  
  return router;
};
