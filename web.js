var express = require("express");
var logfmt = require("logfmt");
var app = express();
var twilio = require("twilio");
var Firebase = require('firebase');
var line = 1;
var fbase = new Firebase('https://flickering-fire-2682.firebaseio.com/');

app.use(logfmt.requestLogger());
app.use(express.bodyParser());

app.post('/sms', function(req, res) {

	//poem
    var twiml = new twilio.TwimlResponse();
    twiml.message('Hello World, you said: ' + req.body.Body);
    
    fbase.push({'number':req.body.From, 'text':req.body.Body});
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());

    if( line == 4){
    	fbase = new Firebase('https://flickering-fire-2682.firebaseio.com/');
    }
    line++;
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});