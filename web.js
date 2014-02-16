var express = require('express');
var logfmt = require('logfmt');
var twilio = require('twilio');
var Firebase = require('firebase');
var $ = jQuery = require('jquery');
var lymbixLib = require('./lymbix/jquery.lymbix.js');
var lymbix = $.lymbix("e731075e67424ea761d9ed92db007d26f5d88d9c");
// lymbix.tonalizeDetailed(phrase, function (object) {
//   $("#phrase").html(object['article']);
//   $("#text").html(object['dominant_emotion'].replace("_"," & "));
//   var rgb = evalColor(object['article_sentiment']['score']);
//   console.log("hi");
//   $("#colors").css('color', "rgb("+rgb[0]+", "+rgb[1]+", "+rgb[2]+")");
//   console.log(object['article_sentiment']['score']);
//   console.log(rgb[2]);
// });
// }


var app = express();
app.use(logfmt.requestLogger());
app.use(express.bodyParser());

var fbase = new Firebase('https://flickering-fire-2682.firebaseio.com/poems');

var line = 1;
var teleNum = [];
var poemString = '';
var prevLine = '';
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
    if(line === 1) {
      newPoem = fbase.push( { 'counter': line,  'fulltext': poemString } );
    }
    prevLine = text;
    poemString += prevLine;
    var ref = newPoem.push( { 'number': author, 'text': text } );
    newPoem.update( { 'counter': line, 'fulltext': poemString } );
    fbase.update( { 'lastLine': prevLine, 'lastRef': ref.name() } );
    line++;
    teleNum = [];
    if(line === 5){
      line = 1;
      poemString = '';
    }

    twiml.message('Thanks for adding a line to the poem');

    //ADD HUE stuff here send count, poemString, and prevLine to be analyzed

  } else{
    if(line === 1) {
      twiml.message('Start a new poem!');
    } else {
      twiml.message('Here\'s the last line:\n ' + prevLine + '\nrespond with the next one!');
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