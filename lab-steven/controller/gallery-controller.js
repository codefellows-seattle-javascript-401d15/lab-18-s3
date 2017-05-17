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
  .catch(err => Promise.reject(createError(400, err.name)));
};

exports.fetchGal = function(reqUser, galId){
  debug('#fetchGal');

  return Gallery.find(galId)
  .then(gallery => gallery)
  .catch(err => Promise.reject(err));

};

exports.updateGal = function(reqBody, galId, reqUserId){
  debug('#updateGal');

  if(!reqBody.name && !reqBody.desc) return Promise.reject(createError(400, 'Update required'));
  return Gallery.findOneAndUpdate({ _id: galId, userId: reqUserId}, reqBody, { new: true })
  .then(data => {
    if (data === null) return Promise.reject(createError(404, 'Gallery Not found'));
    return data;
  })
  .catch(err => Promise.reject(createError(400, err.name)));
};

exports.deleteGal = function(galId, reqUserId){
  debug('#deleteGal');

  return Gallery.findOneAndRemove({ _id: galId, userId: reqUserId})
  .then(data => {
    if (data === null) return Promise.reject(createError(404, 'Gallery Not found'));
    return data;
  })
  .catch(err => Promise.reject(err));
};
