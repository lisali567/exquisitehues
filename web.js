var express = require('express');
var logfmt = require('logfmt');
var twilio = require('twilio');
var Firebase = require('firebase');
var $ = jQuery = require('jquery');
var lymbixLib = require('./lymbix/jquery.lymbix.js');
var lymbix = $.lymbix("e731075e67424ea761d9ed92db007d26f5d88d9c");
var accountSid = 'ACd4f90f2571958e3ac3f697dabb9b45dc';
var authToken = '24cdd8f1cae6c984a78839b7faa15c6d';
var client = require('twilio')(accountSid, authToken);
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
var teleNumLine = [];
var poemContributers = []; //phone numbers of people who have contributed
var poemString = ''; //full poem
var prevLine = ''; //last line of poem
var newPoem;

app.post('/sms', function(req, res) {

  var twiml = new twilio.TwimlResponse();
  var text = req.body.Body;
  var author = req.body.From;

  var numIndex = -1; //look to see if number is in
  for(var i = 0; i < teleNumLine.length; i++) {
    if(author === teleNumLine[i]) {
      numIndex = i;
    }
  }

  if(numIndex !== -1) { //message is to be a new line
    if(line === 1) {
      newPoem = fbase.push( { 'counter': line,  'fulltext': poemString } );
    }
    prevLine = text; //replce last line
    poemString = poemString + '/n' + prevLine; //add last line to full poem
    var ref = newPoem.push( { 'number': author, 'text': text } );
    newPoem.update( { 'counter': line, 'fulltext': poemString } );
    fbase.update( { 'lastLine': prevLine, 'lastRef': ref.name() } );
    line++; //update line count
    teleNumLine = [];


    if(line === 5){ //end of the poem
      line = 1; //reset line count
      poemString = ''; //reset full poem string


      //send poem link to contributors
      for(var j = 0; j < poemContributers.length; j++) {
      	client.messages.create({
    	body: "Wanna see the completed poem? check out: linkkks", //change this l8r
    	to: poemContributers[j],
    	from: "+17184049006"
		}, function(err, message) {
    	process.stdout.write(message.sid);
		});
      }

      poemContributers = [];

    }
        //check to see if the author is already in poemContributers
    var authorFound = false; 
  	for(var h = 0; h < poemContributers.length; h++) {
      if(author === poemContributers[h]) {
        authorFound = true;
      }
	}

	if(!authorFound){ //if author is not in poemContributers add him/her
      poemContributers.push(author);
    }
    twiml.message('Thanks for adding a line to the poem');

    //ADD HUE stuff here send count, poemString, and prevLine to be analyzed

  } else{ //msg was to request last line
    if(line === 1) {
      twiml.message('Start a new poem!');
    } else {
      twiml.message('Here\'s the last line:\n ' + prevLine + '\nrespond with the next one!');
    }
    teleNumLine.push(author);
  }

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log('Listening on ' + port);
});