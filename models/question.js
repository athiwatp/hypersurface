var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

var Schema = mongoose.Schema

var questionSchema = new Schema({
  question: {
    type: String,
    unique: true,
    uniqueCaseInsensitive: true,
    trim: true
  },
  category: String,
  name: String,
  poster: String,
  description: String,
  date: String,
  time: String,
  videoUrl: String,
  photoUrl: String,
  linkUrl: String,
  linkName: String,
  responses: Array,
  numUsers: Number,
  clips: Number,
  totalResponses: Number,
})

questionSchema.plugin(uniqueValidator)

var Question = mongoose.model('Question', questionSchema)

module.exports = Question
