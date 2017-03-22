var path = require('path')
var express = require('express')
var webpack = require('webpack')
var bodyParser = require('body-parser')
var config = require('../config')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var questions = require('../routes/question')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

app.use('/', questions)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var server = module.exports = app.listen(port, function (err) {

  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})

var io = require('socket.io').listen(server)
var _ = require('lodash')
var db = require('../config/database')
var questionCollection = db.collection('questions')

// Log function for messages
function logData(message) {
  var d = new Date()
  var time = '['+ d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() +']'
  console.log(time + message)
}

io.on('connection', function (socket) {


  // Update Main View when a new question is added
  socket.on('new question', function () {
    io.emit('update list')
  })

  // Check if user is connected to a room
  // If so, subtract 1 from active users in room, then remove user
  // Then join room, add question to database, and increase room stats
  // Finally update Poll View and Main View
  socket.on('response', function (data) {
    if (socket.room) {
      questionCollection.update(
        {question: socket.room},
        {$inc: {numUsers: -1}}
      )
      io.to(socket.room).emit('update')
      socket.leave(socket.room)
    }

    socket.join(data.question)
    socket.room = data.question

    questionCollection.update(
      {question: data.question},
      {
        $push: {responses: data.response},
        $inc: {numUsers: 1, totalResponses: 1}
      }
    )

    io.to(data.question).emit('update')
    io.emit('update list')
  })

  // Check if users room is the current room (returning)
  // If so, simply reload data on Poll View
  // Otherwise, subtract user from previous room, join new room, and update
  socket.on('check returning', function (data) {
    if (socket.room === data) {
      socket.emit('reload data')
    } else {
      questionCollection.update(
        {question: socket.room},
        {$inc: {numUsers: -1}}
      )

      io.to(socket.room).emit('update')

      socket.leave(socket.room)
      socket.join(data)
      socket.room = data

      questionCollection.update(
        {question: data},
        {$inc: {numUsers: 1}}
      )

      io.to(data).emit('update')
      io.emit('update list')
    }
  })

  // Increase number of clips by 1
  socket.on('clip', function (data) {
    questionCollection.update(
      {question: data},
      {$inc: {clips: 1}}
    )

    io.emit('update list')
    io.to(data).emit('reload data')
  })

  // Create message object
  // Log user and message
  // Send message object
  socket.on('send message', function (data) {
    var msg = {
      name: data.name,
      message: data.message,
      chatid: data.chatid
    }

    logData(data.name + ': ' + data.message)

    io.to(data.question).emit('message', msg)
  })

  // Update room
  // Remove socket and update
  socket.on('disconnect', function () {
    if (socket.room) {
      questionCollection.update(
        {question: socket.room},
        {$inc: {numUsers: -1}}
      )
      socket.leave(socket.room)
      io.emit('update list')
      io.to(socket.room).emit('reload data')
    }
  })
})
