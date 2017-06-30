'use strict'

const expect = require('chai').expect
const request = require('superagent')
const mongoose = require('mongoose')
const Promise = require('bluebird')

const User = require('../models/user')
const Gallery = require('../models/gallery')
const Picture = require('../models/picture')

require('../server.js')

const url = `http://localhost:${process.env.PORT}`
