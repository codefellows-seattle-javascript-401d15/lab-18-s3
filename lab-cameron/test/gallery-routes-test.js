'use strict';

const superagent = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const chai = require('chai');

const User = require('../models/user');
const Gallery = require('../models/gallery');

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

describe('Gallery Routes', function() {
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(err => done(err));
  });
  describe('#POST', function() {
    before(done => {
      new User(testUser)
      .generatePasswordHash(testUser.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then(token => {
        this.tempToken = token;
        console.log('the tempUser: ', this.tempUser);
        console.log('the tempToken: ', this.tempToken);
        done();
      })
      .catch(err => done(err));
    });

    it('should respond with status 200 on a proper request', done => {
      superagent.post(`${url}/api/gallery`)
      .send(testGallery)
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res).to.have.status(200);
        done();
      })
      .catch(done);
    });

    it('should respond with status 400 if no request body provided', (done) => {
      superagent.post(`${url}/api/gallery`)
      .send('{')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      });
    });

    it('should respond with status 401 if no (or bad) token was provided', done => {
      superagent.post(`${url}/api/gallery`)
      .send(testGallery)
      .then(() => done())
      .catch(err => {
        expect(err.status).to.equal(401);
        done();
      });
    });
  });

  describe('#GET', function() {
    before(done => {
      new User(testUser)
      .generatePasswordHash(testUser.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        return user.generateToken();
      });
      before(token => {
        this.tempToken = token;
        console.log('the tempUser: ', this.tempUser);
        console.log('the tempToken: ', this.tempToken);
        done();
      })
      .catch(err => done(err));
    })
    .then(done => {
      new Gallery(testGallery)
      .then(gallery => {
        gallery.userId = this.tempUser._id;
        gallery.save();
        console.log(gallery);
        done();
      })
      .catch(err => done(err));
    });

    it('should respond with status 200 on a proper request', done => {
      superagent.get(`${url}/api/gallery/${this.tempUser._id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(done);
    });

    it('should respond with status 400 if no token was provided', (done) => {
      superagent.get(`${url}/api/gallery/${this.tempUser._id}`)
      .then(done)
      .catch(err => {
        expect(err.status).to.equal(400);
        done();
      });
    });

    it('should respond with status 404 if the id does not match', done => {
      superagent.get(`${url}/api/gallery/1234`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.tempToken}`)
      .then(() => done())
      .catch(err => {
        expect(err.status).to.equal(404);
        done();
      });
    });
  });
});
