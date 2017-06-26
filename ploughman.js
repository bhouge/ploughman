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

var directoryPrefix = '/sounds/compressed/';
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

