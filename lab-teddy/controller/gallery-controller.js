'use strict';

const debug = require('debug')('cfgram:galler-controller.js');
const Gallery = require('../model/gallery');
const createError = require('http-errors');

module.exports = exports = {};

exports.createNewGallery = function(reqGaller, reqUser){
  debug('#createNewGallery');

  reqGaller.userId = reqUser._id;
  return new Gallery(reqGaller).save()
  .then(gallery => gallery)
  .catch(err => {
    return createError(404, err.message);
  });
};

exports.fetchGallery = function(reqUser, galId){
  debug('#fetchGallery');
  return Gallery.findById(galId)
  .then(gallery => gallery)
  .catch(err => createError(404, err.message));
};

exports.updateGallery = function(reqGaller, galId, userId){
  return Gallery.findOneAndUpdate({_id: galId, useId: userId}, reqGaller, {new:true})
  .then(gallery => {
    if(gallery === null) return createError(404, 'Gallery not found');
    return gallery;
  })
  .catch(err => createError(404, err.message));
};

exports.deleteGallery = function(galId, userId){
  return Gallery.findOneAndRemove({_id: galId, useId: userId})
  .then(gallery => {
    if(gallery === null) return createError(404, 'Gallery Not Found');
    return gallery;
  })
  .catch(err => createError(404, err.message));
};
