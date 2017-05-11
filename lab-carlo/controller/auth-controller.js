const Promise = require('bluebird');
const User = require('../model/user');


module.exports = exports = {};

exports.createUser = function(req, res) {

  let tempPassword = req.body.password;
  req.body.password = null; //extra safety that password is not persisted in req body
  delete req.body.password;

  let newUser = new User(req.body);

  return newUser.generatePasswordHash(tempPassword)
  .then(user => user.save())
  .then(user => user.generateToken())
  // .then(token => res.json(token))
   .catch(err => res.status(err.status).send(err.message));
};

exports.fetchUser = function(res, auth) {
  if(!auth) return Promise.reject(console.error('auth required'));

  return User.findOne({username: auth.username})
  .then(user => user.comparePasswordHash(auth.password))
  .then(user => user.generateToken())
  // .then(token => res.json(token))
  .catch(err => res.status(err.status).send(err.message));

};
