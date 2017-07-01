'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const Promise = require('bluebird');
const Pic = require('../model/pic.js');
const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');
const http = require('chai-http');
const server = require('../server.js');
const chai = require('chai');


mongoose.Promise = Promise;

chai.use(http);

const testUser = {
  username: 'hiHo',
  email: 'hiHo@hiHo.com',
  password: 'superSecret',
};

const testGallery = {
  name: 'uhhu',
  desc: 'the uhhu of all uhhus',
};

const testPic = {
  name: 'momandbaby',
  desc: 'mom and baby smiling at eachother',
  image: `${__dirname}/asset/momandbaby.jpg`,
};

describe('Testing Pic Routes', function() {
  beforeEach(done => {
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
    .catch(done);
  });

  beforeEach(done => {
    testGallery.userId = this.tempUser._id.toString();
    new Gallery(testGallery).save()
    .then(gallery => {
      this.myGallery = gallery;
      console.log(this.myGallery._id, 'hello');
      done();
    })
    .catch(done);
  });



  after(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
      Pic.remove({}),
    ])
    .then(() => done())
    .catch(done);
  });

  describe('#POST Route', function(){
    it('should return a photo model', done => {
      console.log('nope, nope, nope', this.myGallery._id);
      chai.request(server)
      .post(`/api/gallery/${this.myGallery._id}/pic`)
      .set({Authorization: `Bearer ${this.tempToken}`})
      .field('name', testPic.name)
      .field('desc', testPic.desc)
      .attach('image', testPic.image)
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
});
