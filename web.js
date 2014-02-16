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
var prevLine = "";
var newPoem;

app.post('/sms', function(req, res) {

  var twiml = new twilio.TwimlResponse();
  var text = req.body.Body;
  var author = req.body.From;

  var numIndex = -1;
  for(var i = 0; i < teleNum.length; i++) {
    if(author === teleNum[i]) {
      numIndex = i;
    }
  }

  if(numIndex !== -1) {
    if(line === 0) {
      newPoem = fbase.push( { 'counter': line } );
    }
    newPoem.push( { 'number': author, 'text': text } );
    newPoem.update( { 'counter': line } );
    prevLine = text;
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
      twiml.message("Here's the last line: " + prevLine + "\nrespond with the next one!");
    }
    teleNum.push(author);
  }

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});