'use strict';

const chai = require('chai');
const http = require('chai-http');
chai.use(http);
const expect = chai.expect;

const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');
const server = require('../server');
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const testUser = {
  username: 'test-un',
  email: 'test@email.com',
  password: 'test-pw',
};

const testGal = {
  name: 'test-gal',
  desc: 'test-desc',
};

describe('gallery-routes.js', function(){
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

  afterEach(function(done){
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
    .then(() => done())
    .catch(done);
  });

  describe('#POST /api/gallery', () => {

    it('404 on bad route', done => {
      chai.request(server)
      .post('/api/badroute')
      .set({Authorization:`Bearer ${this.tempToken}`})
      .send(testGal)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
    it('401 on request with no valid token', done => {
      chai.request(server)
      .post('/api/gallery')
      .set({Authorization:`Bearer badtoken`})
      .send(testGal)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
    });
    it('400 on bad request', done => {
      chai.request(server)
      .post('/api/gallery')
      .set({Authorization:`Bearer ${this.tempToken}`})
      .send({bad: 'request'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
    });
    it('200 on proper request', done => {
      chai.request(server)
      .post('/api/gallery')
      .set({Authorization:`Bearer ${this.tempToken}`})
      .send(testGal)
      .end((err, res) => {
        if(err) return done(err);
        expect(res).to.have.status(200);
        done();
      });
    });
  });

  describe('#GET /api/gallery/:id', () => {

    beforeEach(done => {
      testGal.userId = this.tempUser._id.toString();
      new Gallery(testGal).save()
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(done);
    });

    after(done  => {
      delete testGal.userId;
      done();
    });

    it('404 on bad route', done => {
      chai.request(server)
      .get(`/api/badroute/${this.tempGallery._id}`)
      .set({Authorization:`Bearer ${this.tempToken}`})
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });

    });
    it('401 on unauthorized request', done => {
      chai.request(server)
      .get(`/api/gallery/${this.tempGallery._id}`)
      .set({Authorization:`Bearer badtoken`})
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
    });
    it('200 on proper request', done => {
      chai.request(server)
      .get(`/api/gallery/${this.tempGallery._id}`)
      .set({Authorization:`Bearer ${this.tempToken}`})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
    });

  });

  describe('#PUT /api/gallery/:id', () => {
    beforeEach(done => {
      testGal.userId = this.tempUser._id.toString();
      new Gallery(testGal).save()
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(done);
    });

    after(done  => {
      delete testGal.userId;
      done();
    });

    it('404 on bad route', done => {
      chai.request(server)
      .put(`/api/badroute/${this.tempGallery._id}`)
      .set({Authorization:`Bearer ${this.tempToken}`})
      .send({name: 'newName'})
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
    it('401 on unauthorized request', done => {
      chai.request(server)
      .put(`/api/gallery/${this.tempGallery._id}`)
      .set({Authorization:`Bearer badToken`})
      .send({name: 'newName'})
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
    });
    it('400 on invalid req body', done => {
      chai.request(server)
      .put(`/api/gallery/${this.tempGallery._id}`)
      .set({Authorization:`Bearer ${this.tempToken}`})
      .send()
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
    });
    it('200 on proper request', done => {
      chai.request(server)
      .put(`/api/gallery/${this.tempGallery._id}`)
      .set({Authorization:`Bearer ${this.tempToken}`})
      .send({name: 'newName'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
    });
  });

  describe('#DELETE /api/gallery/:id', () => {
    beforeEach(done => {
      testGal.userId = this.tempUser._id.toString();
      new Gallery(testGal).save()
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(done);
    });

    after(done  => {
      delete testGal.userId;
      done();
    });

    it('404 on bad route', done => {
      chai.request(server)
      .delete(`/api/badroute/${this.tempGallery._id}`)
      .set({Authorization:`Bearer ${this.tempToken}`})
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
    it('401 on unauthorized request', done => {
      chai.request(server)
      .delete(`/api/gallery/${this.tempGallery._id}`)
      .set({Authorization:`Bearer badToken`})
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
    });
    it('204 on proper request', done => {
      chai.request(server)
      .delete(`/api/gallery/${this.tempGallery._id}`)
      .set({Authorization:`Bearer ${this.tempToken}`})
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
    });
  });

});
