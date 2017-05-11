'use strict'

const expect = require('chai').expect
const request = require('superagent')
const mongoose = require('mongoose')
const Promise = require('bluebird')

const User = require('../models/user')
const Gallery = require('../models/gallery')

const url = `http://localhost:${process.env.PORT}`

const testUser = {
  username: 'testUser',
  password: 'testpass',
  email: 'testUser@test.com'
}

const testGallery = {
  name: 'test gallery',
  desc: 'test gallery description'
}

mongoose.Promise = Promise;

describe('Gallery Routes', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({})
    ])
      .then(() => done())
      .catch(() => done())
  })

  describe('POST: /api/gallery', () => {
    before( done => {
      new User(testUser)
        .generatePassHash(testUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user
          console.log('temp user', this.tempUser)
          return user.generateToken()
        })
        .then( token => {
          this.tempToken = token
          done()
        })
        .catch(() => done())
    })

    it('should return a gallery', done => {
      request.post(`${url}/api/gallery`)
        .send(testGallery)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if (err) return done(err)
          let date = new Date(res.body.created).toString()
          expect(res.body.name).to.equal(testGallery.name)
          expect(res.body.desc).to.equal(testGallery.desc)
          expect(res.body.userId).to.equal(this.tempUser._id.toString())
          expect(date).to.not.equal('Invalid Date')
          done()
        })
    })
  })

  describe('GET: /api/gallery/:id', () => {
    before( done => {
      new User(testUser)
        .generatePassHash(testUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user
          return user.generateToken()
        })
        .then( token => {
          this.tempToken = token
          done()
        })
        .catch(() => done())
    })

    before( done => {
      testGallery.userId = this.tempUser._id.toString()
      new Gallery(testGallery).save()
        .then( gallery => {
          this.tempGallery = gallery
          done()
        })
        .catch(() => done())
    })

    after( () => {
      delete testGallery.userId
    })

    it('should return a gallery', done => {
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if (err) return done(err)
          let date = new Date(res.body.created).toString()
          expect(res.body.name).to.equal(testGallery.name)
          expect(res.body.desc).to.equal(testGallery.desc)
          expect(res.body.userId).to.equal(this.tempUser._id.toString())
          expect(date).to.not.equal('Invalid Date')
          done()
        })
    })
  })
})
