var Terminal = require('xterm').Terminal;
// var AttachAddon = require('xterm-addon-attach').AttachAddon;
var io = require('socket.io-client');

var client = {};

client.run = function(options) {

	options = options || {};

	var socket = io(options.remote, {
		path : '/ssh'
	});
	socket.on('connect', function() {
		var term = new Terminal({
			cols : 120,
			rows : 60,
			useStyle : true,
			screenKeys : true
		});
		var id = socket.id;
		console.log("-> on connect: id -> ", id)

		socket.on('data', function(data) {
			term.write(data);
		});

		term.open(options.parent || document.body);

		// var attachAddon = new AttachAddon(socket);
		// term.loadAddon(attachAddon);

		term.onData(function(data) {
			socket.emit('data', data);
		});

		// term.write('hello world\r\n');

		socket.on('disconnect', function() {
			console.log("-> on disconnect: id -> ", id)
			// term.dispose();
		});

		// for displaying the first command line
		socket.emit('data', '\n');
	});

};

var e = document.getElementById("terminal");
client.run({
	parent : e,
	remote : window.location.host
    // remote : "http://localhost:3000"
})