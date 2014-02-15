// Twilio Credentials 
var accountSid = 'ACd4f90f2571958e3ac3f697dabb9b45dc'; 
var authToken = '24cdd8f1cae6c984a78839b7faa15c6d'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

var Firebase = require('firebase');
var myRootRef = new Firebase('https://flickering-fire-2682.firebaseio.com/messages');
//myRootRef.set("hello world!");
 
/* client.messages('SM5473a30977cefdadf62b1ab6cf572e21').get(function(err, message) { 
	console.log(message.body); 
    });
*/

// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.
/*
client.messages.create({
	to:'+16467633964',
	    from:'+17184049006',
	    body:'ahoy hoy! Testing Twilio and node.js'
	    }, function(error, message) {
	// The HTTP request to Twilio will run asynchronously. This callback
	// function will be called when a response is received from Twilio
	// The "error" variable will contain error information, if any.
	// If the request was successful, this value will be "falsy"
	if (!error) {
	    // The second argument to the callback will contain the information
	    // sent back by Twilio for the request. In this case, it is the
	    // information about the text messsage you just sent:
	    console.log('Success! The SID for this SMS message is:');
	    console.log(message.sid);
 
	    console.log('Message sent on:');
	    console.log(message.dateCreated);
	} else {
	    console.log('Oops! There was an error.');
	}
    });
*/
//		var teststuff = myRootRef.child('messages');

client.messages.list({
	to:'+17184049006'}, function(err, data){
	data.messages.forEach(function(message) {
		console.log(message.body);
		console.log(message.from);
		myRootRef.child('number').set(message.from);
		myRootRef.child('body').set(message.body);
	    });
    });
