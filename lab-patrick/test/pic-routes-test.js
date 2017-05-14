'use strict';

const expect= require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../models/user');
const Gallery = require('../models/gallery');
const Pic = require('../models/pic')

mongoose.Promsie = Promise;

require('../server');

const url = `http://localhost:${process.env.PORT}`;

const testUser = {
  username: 'testUser',
  password: 'testPassword',
  email: 'test@test.com',
};

const testGallery ={
  name: 'testGal',
  desc: 'test desc',
};
