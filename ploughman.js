/**
 * 
 */

var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var listenerCount = 0;
var supremeLeaderCount = 0;
var mysteryUserCount = 0;

var birdFileGroups = [0, 3, 8, 13, 18, 23, 28, 33, 40, 45, 50, 53, 58, 63, 68, 73, 76];

var birdFileNames = [
	"snd_bird_barred_1.wav",
	"snd_bird_barred_2.wav",
	"snd_bird_barred_3.wav",
	"snd_bird_barredowl_1.ogg",
	"snd_bird_barredowl_2.ogg",
	"snd_bird_barredowl_3.ogg",
	"snd_bird_barredowl_4.ogg",
	"snd_bird_barredowl_5.ogg",
	"snd_bird_bluejay_1.ogg",
	"snd_bird_bluejay_2.ogg",
	"snd_bird_bluejay_3.ogg",
	"snd_bird_bluejay_4.ogg",
	"snd_bird_bluejay_5.ogg",
	"snd_bird_catbird_1.ogg",
	"snd_bird_catbird_2.ogg",
	"snd_bird_catbird_3.ogg",
	"snd_bird_catbird_4.ogg",
	"snd_bird_catbird_5.ogg",
	"snd_bird_catbird_alt_1.ogg",
	"snd_bird_catbird_alt_2.ogg",
	"snd_bird_catbird_alt_3.ogg",
	"snd_bird_catbird_alt_4.ogg",
	"snd_bird_catbird_alt_5.ogg",
	"snd_bird_chickadee_06.ogg",
	"snd_bird_chickadee_07.ogg",
	"snd_bird_chickadee_08.ogg",
	"snd_bird_chickadee_1.ogg",
	"snd_bird_chickadee_2.ogg",
	"snd_bird_crow_1.ogg",
	"snd_bird_crow_2.ogg",
	"snd_bird_crow_3.ogg",
	"snd_bird_crow_4.ogg",
	"snd_bird_crow_5.ogg",
	"snd_bird_generic_1_1.ogg",
	"snd_bird_generic_1_2.ogg",
	"snd_bird_generic_1_3.ogg",
	"snd_bird_generic_1_4.ogg",
	"snd_bird_generic_1_5.ogg",
	"snd_bird_generic_1_6.ogg",
	"snd_bird_generic_1_7.ogg",
	"snd_bird_generic_2_1.ogg",
	"snd_bird_generic_2_2.ogg",
	"snd_bird_generic_2_3.ogg",
	"snd_bird_generic_2_4.ogg",
	"snd_bird_generic_2_5.ogg",
	"snd_bird_generic_3_1.ogg",
	"snd_bird_generic_3_2.ogg",
	"snd_bird_generic_3_3.ogg",
	"snd_bird_generic_3_4.ogg",
	"snd_bird_generic_3_5.ogg",
	"snd_bird_goose_1.ogg",
	"snd_bird_goose_2.ogg",
	"snd_bird_goose_3.ogg",
	"snd_bird_mourningdove_1.ogg",
	"snd_bird_mourningdove_2.ogg",
	"snd_bird_mourningdove_3.ogg",
	"snd_bird_mourningdove_4.ogg",
	"snd_bird_mourningdove_5.ogg",
	"snd_bird_robin_1.ogg",
	"snd_bird_robin_2.ogg",
	"snd_bird_robin_3.ogg",
	"snd_bird_robin_4.ogg",
	"snd_bird_robin_5.ogg",
	"snd_bird_screech_1.wav",
	"snd_bird_screech_2.wav",
	"snd_bird_screech_3.wav",
	"snd_bird_screech_4.wav",
	"snd_bird_screech_5.wav",
	"snd_bird_titmouse_1.ogg",
	"snd_bird_titmouse_2.ogg",
	"snd_bird_titmouse_3.ogg",
	"snd_bird_titmouse_4.ogg",
	"snd_bird_titmouse_5.ogg",
	"snd_bird_woodpecker_1.ogg",
	"snd_bird_woodpecker_2.ogg",
	"snd_bird_woodpecker_3.ogg"];
                     

var directoryPrefix = '/sounds/compressed/';
var birdDirectoryPrefix = 'various_birds';
var peopleDirectoryPrefix = 'various_people';

var folderNameArray = [['chirps1', ['chirps1a.mp3',
                                    'chirps1b.mp3',
                                    'chirps1c.mp3']],
                       ['chirps2', ['chirps2a.mp3',
                                    'chirps2b.mp3',
                                    'chirps2c.mp3']],
					   ['chirps3', ['chirps3a.mp3',
                                    'chirps3b.mp3',
                                    'chirps3c.mp3']],
                       ['chirps4', ['chirps4a.mp3',
                                    'chirps4b.mp3',
                                    'chirps4c.mp3',
                                    'chirps4d.mp3']],
                       ['chirps5', ['chirps5a.mp3',
                                    'chirps5b.mp3',
                                    'chirps5c.mp3']],
];


//var connections = {};
//var tableID;

app.get('/controller', function(req, res){
	res.sendFile(__dirname + '/ploughmanCommand.html');
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/listener.html');
});

app.get(/^(.*)$/, function(req, res){
	//if a specific file is requested, pass it on through...
	res.sendFile(__dirname + req.params[0]);
});


io.on('connection', function(socket){
  //console.log('a user connected');
  socket.on('disconnect', function(){
	  if (socket.category == "listener") {
		  listenerCount--;
		  console.log('listener disconnected; listeners remaining: ' + listenerCount);
	  } else if (socket.category == "supreme leader") {
		  supremeLeaderCount--;
		  console.log('supreme leader disconnected; supreme leaders remaining: ' + supremeLeaderCount);
	  } else {
		  console.log('mystery user disconnected; mystery users remaining: ' + mysteryUserCount);
		  mysteryUserCount--;
	  }
  });
  /*
  socket.on('say to someone', function(id, msg){
	    socket.broadcast.to(id).emit('my message', msg);
  });
  */
  socket.on('control message', function(msg){
	  //these are coming from the controller and going to all listeners
	  //actually going to controllers, too; don't think this matters, but could potentially only target listeners
	  console.log('control message: ' + msg);
	  io.emit('control message', msg);
  });
  socket.on('i am', function(msg){
	    //console.log(msg);
	    //io.emit('message', msg);
	  	//you could add a property that is name, so we can know who's disconnecting as well
	  	var splitMSG = msg.split(' ');
	    if (splitMSG[0] == 'listener') {
	    	console.log(msg);
	    	socket.category = splitMSG[0];
	    	//socket.dinerID = deviceIDs[splitMSG[1]];
	    	//connections[socket.dinerID] = socket.id;
	    	//socket.currentCourse = 0;
	    	//socket.emit('you are', socket.dinerID);
	    	listenerCount++;
	    	console.log("listener connected; listeners: " + listenerCount);
	    	//socket.emit('table connection', socket.dinerID);
	    	//io.emit('table connection', "hi mom");
	    	//socket.broadcast.to(tableID).emit('table connection', socket.dinerID);
	    	
	    	//var fileToPush = __dirname + '/sounds/yooo.mp3';
    		//pushSoundToClient(fileToPush, 0, socket);
	    	
	    	var birdFileIndex = Math.floor(Math.random() * (birdFileGroups.length - 1));
	    	console.log('birdFileIndex: ' + birdFileIndex);
	    	var birdGroupStartIndex = birdFileGroups[birdFileIndex];
	    	console.log('birdGroupStartIndex: ' + birdGroupStartIndex);
	    	var numberOfBirdVariations = birdFileGroups[birdFileIndex + 1] - birdFileGroups[birdFileIndex];
	    	console.log('numberOfBirdVariations: ' + numberOfBirdVariations);
	    	for (var i = 0; i < numberOfBirdVariations ; i++) {
    			var nextFileName = birdFileNames[birdGroupStartIndex + i];
    			console.log(nextFileName);
	    		var fileToPush = __dirname + directoryPrefix + birdDirectoryPrefix + '/' + nextFileName;
	    		console.log(fileToPush);
	    		pushSoundToClient(fileToPush, i, socket);
	    	}
	    	
	    	/*
	    	//old way, prior to Michael's sound drop
	    	//pick random folder
	    	var randomFolderID = Math.floor(Math.random() * folderNameArray.length);
	    	console.log(randomFolderID);
	    	var randomFolderName = folderNameArray[randomFolderID][0];
	    	console.log(randomFolderName);
	    	var numberOfVariationsInRandomFolder = folderNameArray[randomFolderID][1].length;
	    	console.log(numberOfVariationsInRandomFolder);
	    	
	    	
    		for (var i = 0; i < numberOfVariationsInRandomFolder; i++) {
    			var nextFileName = folderNameArray[randomFolderID][1][i];
    			console.log(nextFileName);
	    		var fileToPush = __dirname + directoryPrefix + randomFolderName + '/' + nextFileName;
	    		console.log(fileToPush);
	    		pushSoundToClient(fileToPush, i, socket);
	    	}
	    	*/
	    	
	    	//how the birds do it...
	    	/*
	    	for (var i = 1; i <= 29; i++) {
	    		var randomFolder = folderNameArray[Math.floor(Math.random() * folderNameArray.length)];
	    		var fileToPush = __dirname + directoryPrefix + randomFolder + '/Birds' + i + '.mp3';
	    		pushSoundToClient(fileToPush, i, socket);
	    	}
	    	*/
	    	
	    } else if (msg == 'supreme leader') {
	    	socket.category = msg;
	    	supremeLeaderCount++;
	    	console.log("supreme leader connected; supreme leaders: " + supremeLeaderCount);
	    } else {
	    	console.log("mystery user connected; mystery users: " + mysteryUserCount);
	    	mysterUserCount++;
	    }
  });
  socket.emit('get type', 'because you just connected!');
});


function pushSoundToClient(filename, bufferIndex, socket) {
	//console.log('Pushing ' + filename + ' to buffer index ' + bufferIndex + ' on socket ' + socket);
	fs.readFile(filename, function(err, buf){
		if (err) {
			console.log("Error: " + err);
		} else {
			//console.log('audio index:' + bufferIndex);
		    socket.emit('audio', { audio: true, buffer: buf, index: bufferIndex });
		}
	});
}


// is it possible that we could start listening and someone could connect before referenceTone is loaded?
http.listen(8252, function(){
  console.log('listening on *:8252');
});

