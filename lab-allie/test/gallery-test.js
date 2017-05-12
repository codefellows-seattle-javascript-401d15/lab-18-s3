'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../models/user.js');
const Gallery = require('../models/gallery.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const testUser = {
  username: 'testy',
  password: 'abc123',
  email: 'fake@fake.com',
};

const testGallery = {
  name: 'testname',
  desc: 'testdescription',
};

const updateGallery = {
  name: 'newname',
  desc: 'newdesc',
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
  
  describe('POST tests', function() {
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
        done();
      })
      .catch(() => done());
    });
    
    it('should return a gallery', done => {
      request.post(`${url}/api/gallery`)
      .send(testGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        if(err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(testGallery.name);
        expect(res.body.desc).to.equal(testGallery.desc);
        expect(res.body.userId).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        expect(res.status).to.equal(200);
        done();
      });
    });
    
    it('should thrown an error if not given a token', done => {
      request.post(`${url}/api/gallery`)
      .send(testGallery)
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
      .send({name:''})
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  
  describe('GET routes', function() {
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
        done();
      })
      .catch(() => done());
    });
    
    before(done => {
      testGallery.userId = this.tempUser._id.toString();
      new Gallery(testGallery).save()
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(() => done());
    });
    
    after(() => {
      delete testGallery.userId;
    });
    
    it('should return a gallery', done => {
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(testGallery.name);
        expect(res.body.desc).to.equal(testGallery.desc);
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
      new User(testUser)
      .generatePasswordHash(testUser.password)
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
      testGallery.userId = this.tempUser._id.toString();
      new Gallery(testGallery).save()
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(() => done());
    });
    
    after(() => {
      delete testGallery.userId;
    });
    
    it('should update a gallery', done => {
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
      .send(updateGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(updateGallery.name);
        expect(res.body.desc).to.equal(updateGallery.desc);
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