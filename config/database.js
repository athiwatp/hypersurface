var mongoose = require('mongoose')

connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hyperdb'

options = {
  db: {
		native_parser: true
	},
	server: {
		auto_reconnect: true,
		poolSize: 5
	}
}

mongoose.Promise = global.Promise

mongoose.connect(connectionString, options, function (err, res) {
  if (err) {
		console.log('[mongoose log] Error connecting to: ' + connectionString + '. ' + err)
		return process.exit(1)
	}
	else {
		return console.log('[mongoose log] Successfully connected to: ' + connectionString)
	}
})

var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function() {
  return console.log('mongoose open success')
})

/* DELETE QUESTIONS
db.collection('questions').drop(function(err) {
  if (err) {
    console.log('Did not delete.')
  } else {
    console.log('Deleted questions!')
  }
})
*/

module.exports = db
