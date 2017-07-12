'use strict';

const expect = require('chai').expect;
const chai = require('chai');
const http = require('chai-http');
const server = require('../server');
const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

chai.use(http);

describe.only('Gallery Routes', function() {
  let testGallery;
  let userToken;

  describe('POST methods', function() {
    it('should post a user first before we can post a gallery', done => {
      chai.request(server)
      .post('/api/user')
      .set('Content-type', 'application/json')
      .send({ emailAddress:'test@mouse.com', username:'mouse', password:'123'})
      .end((err, res) => {
        userToken = res.body;
        expect(res.status).to.equal(201);
        expect(res.body).to.match(/[A-Za-z0-9\-\._~\+\/]+=*/g);
        expect(userToken).to.not.be.undefined;
        done();
      });
    });

    it('Should respond with status code 201 and gallery in response', done => {
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
        expect(res.body.name).to.be.a('string').that.includes('moose');
        expect(res.body.desc).to.be.a('string').that.includes('moosen');
        expect(res.body.userId).to.match(/[A-Za-z0-9\-\._~\+\/]+=*/g);
        done();
      });
    });

    it('Should respond with status code 404 on invalid request', done => {
      chai.request(server)
      .post('/api/wrong')
      .set({Authorization: `Bearer ${userToken}`})
      .send(testGallery)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('Should respond with status code 401 on unauthorized request', done => {
      chai.request(server)
      .post('/api/gallery')
      .send(testGallery)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  }); //CLOSE POST

  describe('GET methods', function() {
    it('Should respond with status code 200 on proper request', done => {
      chai.request(server)
      .get(`/api/gallery/${testGallery._id}`)
      .set({Authorization: `Bearer ${userToken}`})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('Should respond with status code 401 on unauthorized request', done => {
      chai.request(server)
      .get(`/api/gallery/${testGallery._id}`)
      .set({Authorization: 'NO TOKEN BRO'})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('Should respond with status code 404 on invalid request', done => {
      chai.request(server)
      .get('/api/tas/wrong')
      .set({Authorization: `Bearer ${userToken}`})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('PUT methods', function() {
    it('Should respond with status code 200 and update a gallery on proper request', done => {

      chai.request(server)
      .put(`/api/gallery/${testGallery._id}`)
      .send({name: 'change me'})
      .set({Authorization: `Bearer ${userToken}`})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });

    it('should retrieve the updated gallery', done => {
      chai.request(server)
      .get(`/api/gallery/${testGallery._id}`)
      .set({Authorization: `Bearer ${userToken}`})
      .end((err, res) => {
        let expected = res.body;
        expect(expected.name).to.equal('change me');
        done();
      }); //close end
    }); //close it

    it('Should respond with status code 400 on improper request', done => {
      chai.request(server)
      .put(`/api/gallery/${testGallery._id}`)
      .set('Content-type', 'application/json')
      .send('{')
      .set({Authorization: `Bearer ${userToken}`})
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });

    it('Should respond with status code 401 on unauthorized request', done => {
      chai.request(server)
      .put(`/api/gallery/${testGallery._id}`)
      .send({name: 'change me'})
      .set({Authorization: `BAD TOKEN`})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('Should respond with status code 404 on invalid request', done => {
      chai.request(server)
      .put(`/api/tas`)
      .send({name: 'change me'})
      .set({Authorization: `Bearer ${userToken}`})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('DELETE methods', function() {
    it('Should respond with status code 404 on invalid request', done => {
      chai.request(server)
      .delete(`/wrongurl`)
      .set({Authorization: `Bearer ${userToken}`})
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });

    it('Should respond with status code 204 on proper request', done => {
      chai.request(server)
      .delete(`/api/gallery/${testGallery._id}`)
      .set({Authorization: `Bearer ${userToken}`})
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
  });
});
