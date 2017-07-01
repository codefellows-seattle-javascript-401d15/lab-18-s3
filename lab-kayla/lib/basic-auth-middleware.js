'use strict'

const debug = require('debug')('cfgram:basic-auth-middleware')
const createError = require('http-errors')

module.exports = function(req, ers, next) {
  debug('#basic-auth-middleware')

  let authHeaders = req.headers.Authorization
  if(!authHeaders) return next(createError(401, 'Authorization Headers Required'))

  let base64Str = authHeaders.split('Basic ')[1]
  if(!base64Str) return next(createError(401, 'Username and Password Required'))

  let [username, password] = new Buffer(base64Str, 'base64').toString().split(':')
  req.auth = {username, password}

  if(!req.auth.username) return next(createError(401, 'Username Required'))
  if(!req.auth.password) return next(createError(401, 'Password Required'))

  next()
}
