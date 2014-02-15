var express = require("express");
var logfmt = require("logfmt");
var app = express();
var twilio = require("twilio");

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
    var twiml = new twilio.TwimlResponse();
    twiml.say('Hello World!');

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});