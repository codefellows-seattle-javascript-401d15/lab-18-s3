'use strict';

const expect= require('chai').expect;
const superagent = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../models/user');
const Gallery = require('../models/gallery');
const Pic = require('../models/pic');

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

// const testPic={
//   name: 'test',
//   desc: 'image',
// };

describe('Post route for pictures', function (){
  let tempUser;
  let tempToken;
  let tempGallery;
  let tempPic;
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
      gallery.save();
      done();
    })
    .catch(err => done(err));
  });
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
      Pic.remove({}),
    ])
    .then(() => done())
    .catch(err => done(err));
  });

  describe('POST pic route', function(){
    it('should add pic and return pic data', done =>{
      superagent.post(`${url}/api/gallery/${tempGallery._id}/pic`)
      .set('Content-Type', 'application/json')
      .set({Authorization: `Bearer ${tempToken}`})
      .field('name', 'Raspberry Pi')
      .field('desc', 'A tiny computer')
      .attach('image', `${__dirname}/assets/pigame.jpg`)
      .end((err, res)=>{
        expect(res.status).to.equal(200);
        done();
      });
    });
    it('should respond with 401 with no token', done =>{
      superagent.post(`${url}/api/gallery/${tempGallery._id}/pic`)
      .set('Content-Type', 'application/json')
      .field('name', 'Raspberry Pi')
      .field('desc', 'A tiny computer')
      .attach('image', `${__dirname}/assets/pigame.jpg`)
      .end((err, res)=>{
        console.log(res.body);
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
});
