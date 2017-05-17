'use strict';

const superagent = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const chai = require('chai');

const User = require('../models/user');
const Gallery = require('../models/gallery');
const Image = require('../models/image');

const expect = chai.expect;
mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const testUser = {
  username: 'cameron',
  email: 'cameron@bacon.yum',
  password: 'bacon',
};

const testGallery = {
  name: 'test gallery',
  desc: 'this is the test gallery',
};

const testImage = {
  name: 'test image',
  desc: 'this is the test image',
};

describe('Image Routes', function() {
  let tempUser, tempToken, tempGallery, tempImage;
  beforeEach(done => {
    new User(testUser)
    .generatePasswordHash(testUser.password)
    .then(user => user.save())
    .then(user => {
      tempUser = user;
      return user.generateToken();
    })
    .then(token => {
      tempToken = token;
    })
    .then(() => new Gallery(testGallery))
    .then(gallery => {
      gallery.userId = tempUser._id;
      tempGallery = gallery;
      console.log('the temp gallery: ', tempGallery);
      gallery.save();
      done();
    })
    .catch(err => done(err));
  });
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
      Image.remove({}),
    ])
    .then(() => done())
    .catch(err => done(err));
  });
  describe('#POST /api/gallery/:id/image', function() {
    it('should respond with status 200 on a proper request', done => {
      superagent.post(`${url}/api/gallery/${tempGallery._id}/image`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${tempToken}`)
      .field('name', 'pikachu')
      .field('desc', 'its electric!')
      .attach('image', `${__dirname}/assets/25.png`)
      .then(res => {
        expect(res).to.have.status(200);
        done();
      })
      .catch(done);
    });

    it('should respond with status 400 if no file is attached', (done) => {
      superagent.post(`${url}/api/gallery/${tempGallery._id}/image`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${tempToken}`)
      .field('name', 'pikachu')
      .field('desc', 'its electric!')
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      });
    });

    it('should respond with status 401 if no (or bad) token was provided', done => {
      superagent.post(`${url}/api/gallery/${tempGallery._id}/image`)
      .field('name', 'pikachu')
      .field('desc', 'its electric!')
      .then(() => done())
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      });
    });
  });

  describe('#GET /api/image/:id', function() {
    before(done => {
      new Image(testImage)
      .then(image => {
        image.userId = tempUser._id;
        image.galleryId = tempGallery._id;
        tempImage = image;
        image.save();
        done();
      })
      .catch(err => done(err));
    });

    it('should respond with status 200 on a proper request', done => {
      superagent.get(`${url}/api/image/${tempImage._id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(done);
    });

    it('should respond with status 400 if no token was provided', (done) => {
      superagent.get(`${url}/api/image/${tempImage._id}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      });
    });

    it('should respond with status 404 if the id does not match', done => {
      superagent.get(`${url}/api/image/1234`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${tempToken}`)
      .then(() => done())
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      });
    });
  });
});
