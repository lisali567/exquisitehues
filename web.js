var express = require("express");
var logfmt = require("logfmt");
var app = express();
var twilio = require("twilio");
var Firebase = require('firebase');
var line = 0;
var fbase = new Firebase('https://flickering-fire-2682.firebaseio.com/');
var newPoem;
var prevLine;
var teleNum = [];
//if firstTime is true, should NOT take body as line 1
var firstTime = false;


app.use(logfmt.requestLogger());
app.use(express.bodyParser());

app.post('/sms', function(req, res) {

    //poem
    var twiml = new twilio.TwimlResponse();
    var body = req.body.Body;
    var from = req.body.From;

    //Sentence to join: 'Join the poem!'

    for(i=0;i<teleNum.length;i++){
	if(from==teleNum[i])
	    {
		//if not new & trying to pretend to be
		if(body=="Join the poem!")
		    {
			twim1.message("lol");
			return;
		    }
		else {
		    while(!firstTime) {   
			if(line==0) {
			    newPoem = fbase.push({'counter':line});
			    
			    prevLine = req.body.Body;
			}
			else {
			    twiml.message('Previous Line: ' + prevLine);
    }
			newLine = newPoem.push({'number':req.body.From, 'text':req.body.Body});
			prevLine = req.body.Body;
			line++;
			teleNum.push(from);
			if( line == 4){
			    line = 0;
			    teleNum.length=0;
			}
			
			//add the line
		    }
		}
	    }
	//not in teleNum, so check if joining
	//if joining, do nothing; go again
	//if not joining but new say something
	if(body=="Join the poem!")
	    {
		twiml.message("Start a new poem!");
		firstTime = true;
	    }
	else { twiml.message("sorry bro, you gotta join first!");
	}
	res.writeHead(200, {'Content-Type': 'text/xml'});
	res.end(twiml.toString());

	firstTime=false;
    });

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});