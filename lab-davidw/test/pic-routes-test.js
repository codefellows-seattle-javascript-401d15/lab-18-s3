'use strict';

const server = require('../server');
const User = require('../models/user');
const Gallery = require('../models/gallery');

const chai = require('chai');
const http = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;
