'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../models/user.js');
const Gallery = require('../models/gallery.js');
const Pic = require('../models/pic.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const testUser = {
  username: 'testy2',
  password: 'abc1234',
  email: 'fake@fake.edu',
};

const testGallery = {
  name: 'testname2',
  desc: 'testdescription2',
};

mongoose.Promise = Promise;

describe('Picture routes', function() {
  before(done => {
    new User(testUser)
    .generatePasswordHash(testUser.password)
    .then(user => user.save())
    .then(user => {
      this.tempUser = user;
      console.log('tempuser', this.tempUser);
      return user.generateToken();
    })
    .then(token => {
      this.tempToken = token;
      done();
    })
    .catch(() => done());
  });
  
  let tempGallery;
  before(done => {
    testGallery.userId = this.tempUser._id.toString();
    new Gallery(testGallery).save()
    .then(gallery => {
      tempGallery = gallery;
      done();
    })
    .catch(() => done());
  });
  
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
      Pic.remove({}),
    ])
    .then(() => done());
  });
  
  describe('POST test', function() {
    it('should add a new image', done => {
      request.post(`${url}/api/gallery/${tempGallery._id}/image`)
      .set('Content-Type', 'application/json')
      .set({Authorization: `Bearer ${this.tempToken}`})
      .field('name', 'Lake Blanca')
      .field('description', 'Lake Blanca in the Alpine Lakes Wilderness')
      .attach('image', `${__dirname}/assets/Blanca.jpg`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
  
  describe('DELETE test', function() {
    it('should remove the photo', done => {
      request.delete();
      done();
    });
  });
});