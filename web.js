var twilio = require('twilio');

var resp = new twilio.TwimlResponse();



resp.message('Welcome to Twilio!');

resp.message('Please let us know if we can help during your development.', {



});



console.log(resp.toString());