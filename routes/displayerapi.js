var request = require('request');

exports.convert = function(req, res) {
  var userEmail = req.query.email;
  request( {
    method: 'POST',
    uri: 'http://backpack.openbadges.org/displayer/convert/email',
    json: {email: userEmail}
  }, function (error, response, body) {
    if (!error) {
      res.json(body);
    }
    else {
      console.log("Error");
    }
  });
  
}
