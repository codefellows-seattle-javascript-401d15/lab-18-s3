'use strict'

require('dotenv').load()

const express = require('express')
const cors = require('cors')
const debug = require('debug')('cfgram:server')
const Promise = require('bluebird')
const errorHandler = require('./lib/error-middleware.js')
const bodyParser = require('body-parser').json()
const mongoose = require('mongoose')

const authRoutes = require('./routes/auth-routes.js')
const galleryRoutes = require('./routes/gallery-routes.js')
const pictureRoutes = require('./routes/picture-routes.js')

const app = module.exports = express()
const router = express.Router()
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/cfgram-dev'

mongoose.Promise = Promise
mongoose.connect(MONGODB_URI)

app.use(errorHandler)
app.use(cors())
app.use(bodyParser)
app.use('/api', authRoutes(router))
app.use('/api', galleryRoutes(router))
app.use('/api', pictureRoutes(router))

app.listen(PORT, () => console.log(`Listening on ${PORT}`))

debug('#server module')
