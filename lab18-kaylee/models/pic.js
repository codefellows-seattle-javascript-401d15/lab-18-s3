'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const picSchema = Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  userID: {type: String, required: true},
  galleryID: {type: String, required: true},
  imageURI: {type: String, required: true},
  objectKey: {type: String, required: true},
  created: {type: String, required: true},
});
