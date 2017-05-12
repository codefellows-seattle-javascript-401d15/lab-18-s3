'use strict';

const createError = require('http-errors');
const Promise = require('bluebird');
const User = require('../models/user.js');

module.exports = exports = {};

exports.signUp = function(req) {
  if(!req.body.password) return Promise.reject(createError(400, 'Invalid password'));
  
  let tempPassword = null;
  tempPassword = req.body.password;
  req.body.password = null;
  delete req.body.password;
  
  let newUser = new User(req.body);

  return newUser.generatePasswordHash(tempPassword)
  .then(user => user.save())
  .then(user => {
    return user.generateToken();
  });
};

exports.signIn = function(req) {
  if(!req.body.username) return Promise.reject(createError(400, 'Invalid username'));

  if(!req.body.password) return Promise.reject(createError(400, 'Invalid password'));

  return User.findOne({username: req.body.username})
  .then(user => user.comparePasswordHash(req.body.password))
  .then(user => user.generateToken())
  .then(token => token)
  .catch(err => createError(404, err.message));
};