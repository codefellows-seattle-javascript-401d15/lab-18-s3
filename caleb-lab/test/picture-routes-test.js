'use strict'

const expect = require('chai').expect
const request = require('superagent')
const Promise = require('bluebird')

const User = require('../models/user')
const Gallery = require('../models/gallery')
const Picture = require('../models/picture')

require('../server.js')

const url = `http://localhost:${process.env.PORT}`

const testUser = {
  username: 'watman',
  email: 'watman',
  password: 'watman',
}

const testGallery = {
  name: 'watmansgallery',
  desc: 'watmansgallery',
}

describe('Picture S3 crud', function(){

  before(done => {
    new User(testUser)
    .generatePasswordHash(testUser.password)
    .then(user => user.save())
    .then(user => {
      this.tempUser = user
      return user.generateToken()
    })
    .then(token => {
      this.tempToken = token
      done()
    })
    .catch(() => done())
  })

  before(done => {
    testGallery.userId = this.tempUser._id.toString()
    new Gallery(testGallery).save()
    .then(gallery => {
      this.tempGallery = gallery
      done()
    })
    .catch(() => done())
  })

  afterEach(done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
      Picture.remove({}),
    ])
    .then(() => done())
  })

  describe('Posting a picture', () => {
    it('should post a new image', done => {
      request.post(`${url}/api/picture/${this.tempGallery._id}`)
      .set('Content-Type', 'application/json')
      .set({Authorization: `Bearer ${this.tempToken}`})
      .field('name', 'Copypasta')
      .field('description', 'Essential Copying and Pasting from Stack Overflow')
      .attach('image', `${__dirname}/../assets/copypasta.jpg`)
      .end((err, res) => {
        expect(res.status).to.equal(200)
        done()
      })
    });
  })

})
