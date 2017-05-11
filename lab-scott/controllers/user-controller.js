'use strict'

const User = require('../models/user')
const Promise = require('bluebird')
const createError = require('http-errors')

module.exports = exports = {}

exports.createUser = function(res,reqUser){
  let tempPass = reqUser.password
  reqUser.password = null
  delete reqUser.password

  let newUser = new User(reqUser)
  // let newUser = UserCtrl.createUser(req.body)

  return newUser.generatePassHash(tempPass)
    .then(user => {
      console.log('user ', user);
      return user.save()})
    .then(user => user.generateToken())
    .then(token => res.json(token))
    .catch(err => {
      console.log(err);
      res.status(err.status).send(err)
    })
}

exports.fetchUser = function(res, reqAuth){

  return User.findOne({username: reqAuth.username})
    .then(user => user.comparePassHash(reqAuth.password))
    .then(user => user.generateToken())
    .then(token => res.json(token))
    .catch(err => res.status(err.status).send(err))

}
