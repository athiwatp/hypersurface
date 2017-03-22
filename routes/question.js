var Question = require('../models/question')
var db = require('../config/database')
var ObjectId = require('mongodb').ObjectId
var questionCollection = db.collection('questions')

var express = require('express')
var router = express.Router()

var addQuestion = function (req, res, next) {
  var question = new Question(req.body)
  question.save(function (err, data) {
    if (!err) {
      return res.send({
        msg:'Added question!'
      })
    }
    return res.send({
      msg: 'This question has already been asked.'
    })
  })
}

var getQuestions = function (req, res, next) {
  questionCollection.find({}).toArray(function(err, data) {
    if (!err) {
      return res.send({
        msg:'Loaded questions!',
        data: data
      })
    } else {
      return res.send({
        msg: 'There are no questions.'
      })
    }
  })
}

var loadQuestion = function (req, res, next) {
  questionCollection.findOne({question: req.body.question}, function (err, data) {
    if (!err) {
      return res.send({
        msg: 'Loaded question!',
        data: data
      })
    } else {
      return res.send({
        msg: 'Could not load data.'
      })
    }
  })
}

router.post('/addQuestion', addQuestion)
router.get('/getQuestions', getQuestions)
router.post('/loadQuestion', loadQuestion)

module.exports = router
