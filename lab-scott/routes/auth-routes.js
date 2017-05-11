'use strict'

const debug = require('debug')('cfgram:auth-routes')
const basicAuth = require('../lib/basic-auth-middleware')
const User = require('../models/user')
const UserCtrl = require('../controllers/user-controller')

module.exports = function(router) {
  router.post('/signup', (req, res) => {
    debug('POST /signup')
    UserCtrl.createUser(res, req.body)
  })

  router.get('/signin', basicAuth, (req, res) => {
    debug('GET /signin')
    UserCtrl.fetchUser(res, req.auth)
  })
  return router
}
