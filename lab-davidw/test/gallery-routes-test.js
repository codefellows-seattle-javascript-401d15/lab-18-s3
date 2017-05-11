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

const sampleUser = {
  username: 'testUser',
  password: '1234',
  email: 'test@test.com',
};

const sampleGallery = {
  name: 'test gallery',
  desc: 'test gallery description',
};

chai.use(http);

mongoose.Promise = Promise;

describe('Gallery Routes', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(() => done());
  });

  describe('POST: /api/gallery', () => {
    before( done => {
      new User(sampleUser)
      .generatePasswordHash(sampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        console.log('temp user', this.tempUser);
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(() => done());
    });

    it('should return a gallery', done => {
      chai.request(server)
      .post('/api/gallery')
      .send(sampleGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err , res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(sampleGallery.name);
        expect(res.body.desc).to.equal(sampleGallery.desc);
        expect(res.body.userId).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });

  describe('GET: /api/gallery/:id', () => {
    before( done => {
      new User(sampleUser)
      .generatePasswordHash(sampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempGallery = token;
        done();
      })
      .catch(() => done());
    });

    before( done => {
      sampleGallery.userId = this.tempUser._id.toString();
      new Gallery(sampleGallery).save()
      .then( gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(() => done());
    });

    after( () => {
      delete sampleGallery.userId;
    });

    it('should return a gallery', done => {
      chai.request(server)
      .get(`/api/gallery/${this.tempGallery._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(sampleGallery.name);
        expect(res.body.desc).to.equal(sampleGallery.desc);
        expect(res.body.userId).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });
});
