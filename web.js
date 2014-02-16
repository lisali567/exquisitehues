var express = require('express');
var logfmt = require('logfmt');
var twilio = require('twilio');
var Firebase = require('firebase');

var app = express();
app.use(logfmt.requestLogger());
app.use(express.bodyParser());

var fbase = new Firebase('https://flickering-fire-2682.firebaseio.com/poems');

var line = 0;
var teleNum = [];
var poemString = "";

app.post('/sms', function(req, res) {

  var twiml = new twilio.TwimlResponse();
  var body = req.body.Body;
  var from = req.body.From;

  var numIndex = -1;
  for(var i = 0; i < teleNum.length; i++) {
    if(from === teleNum[i]) {
      numIndex = i;
    }
  }

  if(numIndex !== -1) {
    if(line === 0) {
      newPoem = fbase.push( { 'counter': line } );
    }
    var newLine = newPoem.push( { 'number': req.body.From, 'text': req.body.Body } );
    var prevLine = req.body.Body;
    poemString += prevLine;
    line++;
    teleNum = [];
    if(line === 4){
      line = 0;
      poemString = "";
    }

    twiml.message("Thanks for adding a line to the poem");

    //ADD HUE stuff here send count, poemString, and prevLine to be analyzed

  } else{
    if(line === 0) {
      twiml.message("Start a new poem!");
    } else {
      twiml.message("Here's the last line: " + prevLine + "/nrespond with the next one!");
    }
    teleNum.push(from);
  }

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});