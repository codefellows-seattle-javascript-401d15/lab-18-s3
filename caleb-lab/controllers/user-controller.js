'use strict'

const User = require('../models/user.js')
const debug = require('debug')('cfgram:user-controller')
const createError = require('http-errors')

module.exports = exports = {}

exports.createUser = function(body){
  debug('#createUser')
  if(!body) return Promise.reject(createError(400, '!!No user!!'))
  if(!body.password) return Promise.reject(createError(400, '!!no password!!'))
  let tempPassword = body.password
  body.password = null
  delete body.password
  let newUser = new User(body)
  return newUser.generatePasswordHash(tempPassword)
    .then(user => user.save())
    .then(user => user.generateToken())
    .then(token => Promise.resolve(token))
    .catch(err => Promise.reject(err))
}

exports.fetchUser = function(auth){
  debug('#fetchUser')
  return User.findOne({username: auth.username})
  .then(user => user.comparePasswordHash(auth.password))
  .then(user => user.generateToken())
  .then(token => Promise.resolve(token))
  .catch(err => Promise.reject(err))
}
