// 'use strict';
//
// const expect = require('chai').expect;
// const request = require('superagent');
// const mongoose = require('mongoose');
// const Promise = require('bluebird');
// const User = require('../models/user');
// const Gallery = require('../models/gallery');
// const Pic = require('../models/pic');
//
// require('../server.js');
//
// const url = `http://localhost:${process.env.PORT}`;
//
// describe('pics', function() {
//
//   const exampleUser = {
//     username: 'exampleuser',
//     password: '1234',
//     email: 'exampleuser@test.com',
//   };
//
//   const exampleGallery = {
//     name: 'test gallery',
//     desc: 'test gallery description',
//   };
//
//   mongoose.Promise = Promise;
//
//   describe('Pic tests', function() {
//     before(done => {
//       new User(exampleUser)
//       .generatePasswordHash(exampleUser.password)
//       .then(user => user.save())
//       .then(user => {
//         this.tempUser = user;
//         console.log('temporary user', this.tempUser);
//         return user.generateToken();
//       })
//       .then(token => {
//         this.tempToken = token;
//         done();
//       })
//       .catch(() => done());
//     });
//
//     let tempGallery;
//     before(done => {
//       exampleGallery.userId = this.tempUser._id.toString();
//       new Gallery(exampleGallery).save()
//       .then(gallery => {
//         tempGallery = gallery;
//         done();
//       })
//       .catch(() => done());
//     });
//
//     afterEach(done => {
//       Promise.all([
//         User.remove({}),
//         Gallery.remove({}),
//         Pic.remove({}),
//       ])
//       .then(() => done());
//     });
//
//     describe('POST test', function() {
//       it('should add a new image', done => {
//         request.post(`${url}/api/gallery/${tempGallery._id}/pic`)
//         .set('Content-Type', 'application/json')
//         .set({Authorization: `Bearer ${this.tempToken}`})
//         .field('name', 'bruce springsteen')
//         .field('description', 'bruce springsteen love')
//         .attach('image', `${__dirname}/assets/BruceSpringsteen.jpg`)
//         .end((err, res) => {
//           console.log(res);
//           expect(res.status).to.equal(200);
//           done();
//         });
//       });
//     });
//
//   });
// });
