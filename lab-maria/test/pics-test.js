'use strict';

const chai = require('chai');
const expect = chai.expect;
const http = require('chai-http');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const server = require('../server');

mongoose.Promise = Promise;
chai.use(http);


describe('PIC ROUTES', function() {
  describe('POST pic', function() {
    let testGallery;
    let userToken;
    let testPic;
    it('should post a user first before we can post a gallery', done => {
      chai.request(server)
      .post('/api/user')
      .set('Content-type', 'application/json')
      .send({ emailAddress:'test@moose.com', username:'mooose', password:'test123'})
      .end((err, res) => {
        userToken = res.body;
        expect(res.status).to.equal(201);
        expect(res.body).to.match(/[A-Za-z0-9\-\._~\+\/]+=*/g);
        expect(userToken).to.not.be.undefined;
        done();
      });
    });

    it('post a gallery before we post a pic', done => {
      chai.request(server)
      .post(`/api/gallery`)
      .set({Authorization: `Bearer ${userToken}`})
      .send({
        name: 'moose',
        desc: 'i saw a flock of moosen',
      })
      .end((err, res) => {
        testGallery = res.body;
        expect(res.status).to.equal(201);
        done();
      });
    });

    it('should post a pic with 201 success and a token as response', done => {
      chai.request(server)
      .post(`/api/gallery/${testGallery._id}/pic`)
      .set({Authorization: `Bearer ${userToken}`})
      .field('name', 'shrooms')
      .field('desc', 'pt')
      .attach('image', `${__dirname}/testPic.png`)
      .end((err, res) => {
        testPic = res.body;
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('name').that.equals('shrooms');
        expect(res.body).to.have.property('desc').that.equals('pt');
        expect(res.body).to.have.property('userID').that.matches(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);
        expect(res.body).to.have.property('galleryID').that.equals(testGallery._id);
        expect(res.body).to.have.property('imageURI').that.equals(`https://cfgram-backend.s3.amazonaws.com/${res.body.objectKey}`);
        expect(res.body).to.have.property('objectKey').that.equals(res.body.imageURI.slice(40));
        done();
      });
    });

    it('should return a 404 on bad route', done => {
      chai.request(server)
      .post('/api/gallery/pic')
      .set({Authorization: `Bearer ${userToken}`})
      .field('name', 'shroooooms')
      .field('desc', 'pretty')
      .attach('image', `${__dirname}/testPic.png`)
      .end((err, res) => {
        expect(res).to.have.property('status')
          .that.is.a('number')
          .that.equals(404);
        done();
      });
    });

    it('should return a 400 with missing file', done => {
      chai.request(server)
      .post(`/api/gallery/${testGallery._id}/pic`)
      .set({Authorization: `Bearer ${userToken}`})
      .field('name', 'shrooms')
      .field('desc', 'pt')
      .end((err, res) => {
        expect(res).to.have.property('status')
          .that.is.a('number')
          .that.equals(500);
        done();
      });
    });

    describe('GET pic', function() {
      it('should get a pic with 200 status', done => {
        chai.request(server)
        .get(`/api/pic/${testPic._id}`)
        .set({Authorization: `Bearer ${userToken}`})
        .end((err, res) => {
          expect(res).to.have.property('status')
            .that.is.a('number')
            .that.equals(200);
          done();
        });
      });

      it('should return a 404 on bad route', done => {
        chai.request(server)
        .get('/api/pic')
        .set({Authorization: `Bearer ${userToken}`})
        .end((err, res) => {
          expect(res).to.have.property('status')
            .that.is.a('number')
            .that.equals(404);
          done();
        });
      });

      it('should return a 401 with no auth header', done => {
        chai.request(server)
        .get(`/api/pic/${testPic._id}`)
        .end((err, res) => {
          expect(res).to.have.property('status')
            .that.is.a('number')
            .that.equals(401);
          done();
        });
      });

      it('should return a 404 on bad id', done => {
        chai.request(server)
        .get(`/api/pic/123`)
        .set({Authorization: `Bearer ${userToken}`})
        .end((err, res) => {
          expect(res).to.have.property('status')
            .that.is.a('number')
            .that.equals(400);
          done();
        });
      });

      describe('DELETE methods', function() {

        it('should delete with a 204 status', done => {
          chai.request(server)
          .delete(`/api/pic/${testPic._id}`)
          .set('Content-type', 'application/json')
          .set({Authorization: `Bearer ${userToken}`})
          .end((err, res) => {
            expect(res.status).to.equal(204);
          });
          done();
        });
      });
    });
  });
});
