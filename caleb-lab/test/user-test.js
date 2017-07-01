'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user.js');

mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleUser',
  password: '1234',
  email: 'wat-man@watcave.hero',
};

describe('Auth Routes', function(){
  describe('POST /api/signup', function(){
    describe('with a valid body', function(){
      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });
      it('should return a 200 success', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });


  describe('GET request. this should GET a pre-made user, and return a 200.', function(){
    describe('with a valid body', function(){
      before( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then( user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });

      it('should return a 200, success', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleUser', 1234)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});
