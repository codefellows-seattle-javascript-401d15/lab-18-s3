'use strict';

const createError = require('http-errors');
const Llama = require('../models/llama');
const debug = require('debug')('cfgram:llama-routes');
const bearerAuth = require('../lib/bearer-auth-middleware');

module.exports = function(router) {
  router.post('llama', bearerAuth, (req, res) => {
    debug('#POST /api/llama');

    req.body.userId = req.user._id;
    new Llama(req.body).save()
    .then(llama => res.json(llama))
    .catch(err => {
      console.log(err);
      res.status(err.status).send(err.message);
    });
  });

  router.get('/api/llama/:id', bearerAuth, (req, res) => {
    debug('#GET /api/llama/:id');

    Llama.findById(req.params.id)
    .then(llama => {
      if(llama.userId.toString() !== req.user._id.toString()) {
        return createError(401, 'You are llamaless');
      }
      res.json(llama);
    })
    .catch(err => res.status(err.status).send(err.message));
  });

  router.put('/api/llama', bearerAuth, (req, res) => {
    debug('#PUT /api/llama/');

    Llama.findByIdAndUpdate(req.params.id)
    .then(llama => {
      if(llama.userId.toString() !== req.user._id.toString()) {
        return createError(401, 'No llama for you');
      }
      res.json(llama);
    });
  });

  router.delete('/api/remove', bearerAuth, (req, res) => {
    debug('#DELETE /api/llama');

    Llama.findByIdAndRemove(req.params.id)
    .then(llama => {
      if(llama.userId.toString() !== req.user._id.toString()) {
        return createError(400, 'Llama will not be removed.');
      }
      res.json(llama);
    });
  });

  return router;
};
