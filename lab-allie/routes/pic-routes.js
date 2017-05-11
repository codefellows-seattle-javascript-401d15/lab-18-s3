'use strict';

const picCtrl = require('../controller/pic-controller.js');
const debug = require('debug')('cfgram:pic-routes');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const multer = require('multer');  
const dataDir = `${__dirname}/../data`; 
const upload = multer({dest: dataDir});  

module.exports = function(router) {
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) => {
    debug('#POST /pic/:id');
    picCtrl.uploadPic(req)
    .then(pic => res.json(pic))
    .catch(err => res.send(err));
  });
  
  router.get('/pic/:id', bearerAuth, (req, res) => {
    debug('#GET /pic/:id');
    
  });
  
  router.delete('/pic/:id', bearerAuth, (req, res) => {
    debug('#DELETE /pic/:id');

  });
  
  return router;
};