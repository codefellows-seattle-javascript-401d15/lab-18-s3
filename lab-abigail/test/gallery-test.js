'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../models/user.js');
const Gallery = require('../models/gallery.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com',
};

const exampleGallery = {
  name: 'example',
  desc: 'example description',
};

const newGallery = {
  name: 'new gallery',
  desc: 'new gallery description',
};

mongoose.Promise = Promise;

describe('Gallery routes', function() {
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(() => done());
  });

  describe('POST', function() {
    before(done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then(token => {
        this.tempToken = token;
        done();
      })
      .catch(() => done());
    });

    it('should create a gallery', done => {
      request.post(`${url}/api/gallery`)
      .send(exampleGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        console.log(res.body.name);
        console.log(res.status);
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleGallery.name);
        expect(res.body.desc).to.equal(exampleGallery.desc);
        expect(res.body.userId).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should thrown a 401 error if not given a token', done => {
      request.post(`${url}/api/gallery`)
      .send({name: ''})
      .set({
        Authorization: `Bearer `,
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should return a "bad request" error if not given a correct body', done => {
      request.post(`${url}/api/gallery`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        console.log(res.body);
        expect(res.status).to.equal(500);
        done();
      });
    });
  });

  describe('GET routes', function() {
    before(done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then(token => {
        this.tempToken = token;
        done();
      })
      .catch(() => done());
    });

    before(done => {
      exampleGallery.userId = this.tempUser._id.toString();
      new Gallery(exampleGallery).save()
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(() => done());
    });

    after(() => {
      delete exampleGallery.userId;
    });

    it('should return a gallery', done => {
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleGallery.name);
        expect(res.body.desc).to.equal(exampleGallery.desc);
        expect(res.body.userId).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should throw an error if given the wrong credentials', done => {
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
      .set({
        Authorization: `Bearer `,
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should throw an error if given an invalid id', done => {
      request.get(`${url}/api/gallery/`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('PUT routes', function() {
    before(done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then(token => {
        this.tempToken = token;
        done();
      })
      .catch(() => done());
    });

    before(done => {
      exampleGallery.userId = this.tempUser._id.toString();
      new Gallery(exampleGallery).save()
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(() => done());
    });

    after(() => {
      delete exampleGallery.userId;
    });

    it('should update a gallery', done => {
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
      .send(newGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(newGallery.name);
        expect(res.body.desc).to.equal(newGallery.desc);
        expect(res.body.userId).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should throw an error if given the wrong credentials', done => {
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
      .set({
        Authorization: `Bearer `,
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should throw an error if given an invalid id', done => {
      request.put(`${url}/api/gallery/`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
});
