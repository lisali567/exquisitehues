// Twilio Credentials 
var accountSid = 'ACd4f90f2571958e3ac3f697dabb9b45dc'; 
var authToken = '24cdd8f1cae6c984a78839b7faa15c6d'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

var Firebase = require('firebase');
var myRootRef = new Firebase('https://flickering-fire-2682.firebaseio.com/');
//myRootRef.set("hello world!");
 

var i = 1;

client.messages.list({
	to:'+17184049006'}, function(err, data){
	data.messages.forEach(function(message) {
		console.log(message.body);
		console.log(message.from);
		var teststuff = myRootRef.child('messages'+i);
		teststuff.update({'number':message.from, 'body':message.body});
		console.log("k");
		i++;
	    });
    });