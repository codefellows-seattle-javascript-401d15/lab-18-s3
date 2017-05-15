'use strict';

const chai = require('chai');
const http = require('chai-http');
const expect = chai.expect;
chai.use(http);

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

// const awsMocks = require('./lib/aws-mocks');
const server = require('../server');
const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');
const Pic = require('../model/pic');

const testUser = {
  username: 'test-un',
  email: 'test@email.com',
  password: 'test-pw',
};

const testGal = {
  name: 'test-gal',
  desc: 'test-desc',
};

const testPic = {
  name: 'test-pic',
  desc: 'test-desc',
  image: `${__dirname}/pics/testpic.png`,
};

describe('pic-routes.js', function(){
  beforeEach(done => {
    new User(testUser)
    .genPassHash(testUser.password)
    .then(user => user.save())
    .then(user => {
      this.tempUser = user;
      return user.genToken();
    })
    .then(token => {
      this.tempToken = token;
      done();
    })
    .catch(done);
  });

  beforeEach(done => {
    testGal.userId = this.tempUser._id.toString();
    new Gallery(testGal).save()
    .then(gallery => {
      this.tempGallery = gallery;
      done();
    })
    .catch(done);
  });

  afterEach(done  => {
    delete testGal.userId;
    done();
  });

  afterEach(done => {
    Promise.all([
      Pic.remove({}),
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(done);
  });

  describe('#POST /api/gallery/:id/pic', () => {
    it('responds with 404 on bad route', done => {
      chai.request(server)
      .post(`/api/gallery/${this.tempGallery._id}/badroute`)
      .set({Authorization:`Bearer ${this.tempToken}`})
      .field('name', testPic.name)
      .field('desc', testPic.desc)
      .attach('image', testPic.image)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
    it('responds with 400 on bad request', done => {
      chai.request(server)
      .post(`/api/gallery/${this.tempGallery._id}/pic`)
      .set({Authorization:`Bearer ${this.tempToken}`})
      .field('name', testPic.name)
      .field('desc', testPic.desc)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
    });
    it('responds with 401 on invalid bearer token', done => {
      chai.request(server)
      .post(`/api/gallery/${this.tempGallery._id}/pic`)
      .set({Authorization:`Bearer badToken`})
      .field('name', testPic.name)
      .field('desc', testPic.desc)
      .attach('image', testPic.image)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
    });
    it('responds with 200 on proper request', done => {
      chai.request(server)
      .post(`/api/gallery/${this.tempGallery._id}/pic`)
      .set({Authorization:`Bearer ${this.tempToken}`})
      .field('name', testPic.name)
      .field('desc', testPic.desc)
      .attach('image', testPic.image)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
    });
  });

  // describe('#GET /api/pic/:id', function(){
  //   it('responds with 404 on bad route', done => {
  //
  //
  //   });
  //   it('responds with 400 on bad request', done => {
  //
  //
  //   });
  //   it('responds with 401 on invalid bearer token', done => {
  //
  //
  //   });
  //   it('responds with 201? on proper request', done => {
  //
  //
  //   });
  // });

//   describe('#DELETE /api/pic/:id', function(){
//     it('responds with 404 on bad route', done => {
//
//       done();
//     });
//     it('responds with 400 on bad request', done => {
//
//       done();
//     });
//     it('responds with 401 on invalid bearer token', done => {
//
//       done();
//     });
//     it('responds with 204 on proper request', done => {
//
//       done();
//     });
//   });
//
//
});
