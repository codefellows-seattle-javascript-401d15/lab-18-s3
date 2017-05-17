'use strict';

const User = require('../models/user');
const debug = require('debug')('cfgram:auth-contoller');
const basicAuth = require('../lib/basic-auth-middleware');

module.exports = exports = {};

exports.addNewUser = function(body){
  debug('#addNewUser');

  let tempPassword = body.password;
  body.password = null;
  delete body.password;

  // console.log('the body ', body);
  let newUser = new User(body);
  return newUser.generatePasswordHash(tempPassword)
  .then(user => user.save())
  .then(user => user.generateToken())
  .then(token => Promise(token))
  .catch(err => Promise(err.status).send(err));
};

exports.getUser = function(auth){
  debug('#getUser');

  return User.findOne({username: auth.username})
  .then(user => user.comparePasswordHash(auth.password))
  .then(user => user.generateToken())
  .then(token => Promise(token))
  .catch(err => Promise(err.status).send(err));
};


// exports.putUser = function(body, auth){
// debug('#putUser');
//
// return User.findOne({username: auth.username})
// .then(user => user.comparePasswordHash(auth.password))
// .then(user => user.generateToken())
// .then(token => Promise(token))
// .catch(err => Promise(err.status).send(err));


// };
