'use strict';

const picCtrl = require('../controller/pic-controller.js');
const debug = require('debug')('cfgram:pic-routes');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});

module.exports = function(router){
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST gallery/:id/pic');

    return picCtrl.createPic(req)
    .then(pic => res.json(pic))
    .catch(err => res.status(err.status).send(err.message));
  });


  router.delete('/gallery/:galleryid/pic/:picid', bearerAuth, (req, res) => {
    debug('#DELETE');
    picCtrl.deletePic(req.params.picid)
    .then(err => res.status(204).send(err.message))
    .catch(err => res.send(err));
  });

  return router;
};
