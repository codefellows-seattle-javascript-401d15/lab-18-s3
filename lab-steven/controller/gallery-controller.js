'use strict';

const debug = require('debug')('cfgram: gallery-controller');
const Gallery = require('../model/gallery');
const createError = require('http-errors');


module.exports = exports = {};

exports.createGal = function(reqBody, reqUser){
  debug('#createGal');

  reqBody.userId = reqUser._id;
  return new Gallery(reqBody).save()
  .then(gallery => gallery)
  .catch(err => createError(400, err.message));
};

exports.fetchGal = function(reqUser, galId){
  debug('#fetchGal');

  return Gallery.find(galId)
  .then(gallery => gallery)
  .catch(err => createError(404, err.message));

};

exports.updateGal = function(reqBody, galId, reqUserId){
  debug('#updateGal');

  return Gallery.findOneAndUpdate({ _id: galId, userId: reqUserId}, reqBody, { new: true })
  .then(data => {
    if (data === null) return createError(404, 'Gallery Not found');
    return data;
  })
  .catch(err => createError(err.status, err.message));
};

exports.deleteGal = function(galId, reqUserId){
  debug('#deleteGal');

  return Gallery.findOneAndRemove({ _id: galId, userId: reqUserId})
  .then(data => {
    if (data === null) return createError(404, 'Gallery Not found');
    return data;
  })
  .catch(err => createError(err.status, err.message));
};
