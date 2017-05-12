'use strict';

const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});
// const createError = require('http-errors');

const bearerAuth = require('../lib/bearer-auth-middleware');
const picCtrl = require('../controller/pic-controller');


module.exports = function(router){
  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res) =>{
    picCtrl.createItem(req)
    .then(pic => res.json(pic))
    .catch(err => res.status(err.status).send(err.message));
  });
  return router;
};
