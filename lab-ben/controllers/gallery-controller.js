'use strict';

const createError = require('http-errors');
const Gallery = require('../models/gallery.js');
const debug = require('debug')('cfgram:gallery-controller');

module.exports = exports = {};

exports.addGallery = function(req) {
  debug('gallery-controller addGallery');

  req.body.userId = req.user_id;
  return new Gallery(req.body).save();
};

exports.findGallery = function(id) {
  debug('gallery-controller findGallery');

  Gallery.findById(id)
  .then(gallery => {
    if(gallery.userId.toString() !== id) {
      return createError(401, 'Invalid user');
    }
    return gallery;
  });
};

exports.updateGallery = function(id, body) {
  Gallery.findByIdAndUpdate(id, {$set: {
    name: body.name,
    desc: body.desc,
    created: body.created,
  }}).save()
  .catch(err => err);
};

exports.removeGallery = function(id) {
  Gallery.remove({id: id});
};
