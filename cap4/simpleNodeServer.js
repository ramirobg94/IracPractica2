var static = require('node-static');

var http = require('http');


// Create a node-static server instance listening on port 8080
var file = new(static.Server)();


var port = process.argv[2] ? process.argv[2] : 8080;

var fs = require('fs')

fs.readFile(__dirname + '/js/simpleNodeClient.js', 'utf8', (err,data) => {
  if (err) {
    return console.log(err);
  }
console.log()
  var result = data.replace(/localhost:([0-9])\w+/g, 'localhost:'+ port );

  fs.writeFile(__dirname + '/js/simpleNodeClient.js', result, 'utf8', (err) => {
     if (err) return console.log(err);
  });
});

// We use the http module�s createServer function and
// use our instance of node-static to serve the files
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(port);

console.log("server on port:", port);

// Use socket.io JavaScript library for real-time web applications
var io = require('socket.io').listen(app);

// Let's start managing connections...
io.sockets.on('connection', function (socket){

		// Handle 'message' messages
        socket.on('message', function (message) {
                if(message){
                    console.log('S --> Got message: ', message);

                    socket.broadcast.to(message.channel).emit('message', message.message);
                }
        });

                // Handle 'create or join' messages
                socket.on('create or join', function (channel) {
					//mac 02-2017
                    var numClients = io.sockets.adapter.rooms[channel]?io.sockets.adapter.rooms[channel].length:0;

                console.log('numclients = ' + numClients);

                // First client joining...
                if (numClients == 0){
                        socket.join(channel);
                        socket.emit('created', channel);
                // Second client joining...
                } else if (numClients == 1) {
                        // Inform initiator...
                		io.sockets.in(channel).emit('remotePeerJoining', channel);
                		// Let the new peer join channel
                        socket.join(channel);

                        socket.broadcast.to(channel).emit('broadcast: joined', 'S --> \
                        		broadcast(): client ' + socket.id + ' joined channel ' + channel);
                } else { // max two clients
                		console.log("Channel full!");
                        socket.emit('full', channel);
                }
        });

        // Handle 'response' messages
        socket.on('response', function (response) {
            console.log('S --> Got response: ', response);

            // Just forward message to the other peer
            socket.broadcast.to(response.channel).emit('response', response.message);
        });

        // Handle 'Bye' messages
        socket.on('Bye', function(channel){
        	// Notify other peer
        	socket.broadcast.to(channel).emit('Bye');

        	// Close socket from server's side
        	socket.disconnect();
        });

        // Handle 'Ack' messages
        socket.on('Ack', function () {
            console.log('Got an Ack!');
            // Close socket from server's side
        	socket.disconnect();
        });

		// Utility function used for remote logging
		function log(){
			var array = [">>> "];
			for (var i = 0; i < arguments.length; i++) {
				array.push(arguments[i]);
			}
			socket.emit('log', array);
		};
});