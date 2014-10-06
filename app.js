var request = require('request');
var MongoClient = require('mongodb').MongoClient;

// Retrieves cards and inserts them into MongoDb
function getCards() {

  // Set request parameters
  var options = {
    url: 'https://irythia-hs.p.mashape.com/cards',
    headers: {
      'X-Mashape-Key': 'pP8PZx0e8wmshjvJ2HhBvborvOB3p19pHbojsnroMmM9Izh9MM'
    }
  };

  // Begin request
  request.get(options, function(error, response, body) {

    // If request is successful
    if (!error && response.statusCode == 200) {
      cards = JSON.parse(body);

      // Try to connect to db
      MongoClient.connect('mongodb://localhost:27017/hearthstone', function (err, db) {

        // If successfully connected to db
        if (!err) {
          console.log('Connected to MongoDb!');
          var collection = db.collection('cards');

          // Drop collection if it already exists
          collection.drop(function(err, res) {
            if (!err) {
              console.log('Collection dropped')
            } else {
              console.log(err);
            }
          })

          // Insert cards into collection
          collection.insert(cards, function(err, res) {
            if (!err) {
              console.log('Cards inserted into collection');
            }
              else {
              console.log(err);
            }
          });

        } else {
          // Log errors if unable to connect to db
          console.log('Error connecting to MongoDb: ' + err);
        }
      });

    } else {
      // Log request errors
      console.error('Error: ' + error);
    }
  });
}

