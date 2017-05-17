'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('cfgram: bearer-auth-middleware');
const User = require('../model/user');

module.exports = function(req, res, next) {
  debug('#bearer-auth-middleware');

  let authHeaders = req.headers.authorization;
  if(!authHeaders) return next(createError(401, 'Auth Headers Required'));

  let token = authHeaders.split('Bearer ')[1];
  if(!token) return next(createError(401, 'Token Required'));

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if(err) return next(createError(401, err.name));

    User.find({findHash: decoded.token})
    .then(user => {
      req.user = user[0];
      next();
    })
    .catch(err => next(createError(401, err.name)));
  });
};
