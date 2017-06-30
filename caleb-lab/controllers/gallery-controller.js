'use strict'

const debug = require('debug')('cfgram:gallery-controller.js')
const Gallery = require('../models/gallery.js')
const createError = require('http-errors')

module.exports = exports = {}

exports.createGallery = function(gallery){
  debug('#createGallery')
  if(!gallery) return Promise.reject(createError(400, '!!no gallery!!'))
  console.log(gallery)
  return new Gallery(gallery).save()
}

exports.fetchGallery = function(id){
  debug('#fetchGallery')
  if(!id) return Promise.reject(createError(400, '!!no id!!'))
  return Gallery.findById(id)
  .then(gallery => Promise.resolve(gallery))
  .catch(() => Promise.reject(createError(404, 'gallery not found')))
}

exports.updateGallery = function(id, gallery){
  debug('#updateGallery')
  if(!id) return Promise.reject(createError(400, '!!no id!!'))
  if(!gallery) return Promise.reject(createError(400, '!!no gallery!!'))
  return Gallery.findByIdAndUpdate(id, gallery, {new: true})
  .then(gallery => Promise.resolve(gallery))
  .catch(() => Promise.reject(createError(404, 'gallery not found')))
}

exports.deleteGallery = function(id){
  debug('#deleteGallery')
  if(!id) return Promise.reject(createError(400, '!!no id, id required'))
  Gallery.findById(id)
  .then(gallery => console.log(`Gallery DELETED: \n`, gallery))
  .catch(err => Promise.reject(err))
  return Gallery.findByIdAndRemove(id)
}
