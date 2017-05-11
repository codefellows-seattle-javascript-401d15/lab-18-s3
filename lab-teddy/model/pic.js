'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const picSchema = Schema({
  name:{type: String, require: true},
  desc:{type: String, require: true},
  userID:{type: Schema.Types.ObjectId, require: true},
  galleryID:{type: Schema.Types.ObjectId, require: true},
  imageURL:{type: String, require: true, unique: true},
  objectKey:{type: String, require: true, unique: true},
  created:{type: String, require: true, default: Date.now},
});

module.exports = mongoose.module('pic', picSchema);
